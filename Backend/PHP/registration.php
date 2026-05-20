<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

session_start();
require_once "db_connection.php";
require_once "auth_middleware.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {




    // ─── NORMAL ───────────────────────────────────────────────
    $_username  = isset($_POST["username"])  ? trim($_POST["username"])  : "";
    $_firstname = isset($_POST["firstname"]) ? trim($_POST["firstname"]) : "";
    $_lastname  = isset($_POST["lastname"])  ? trim($_POST["lastname"])  : "";
    $_usermail  = isset($_POST["usermail"])  ? trim($_POST["usermail"])  : "";
    $_password  = isset($_POST["userpass"])  ? trim($_POST["userpass"])  : "";

    if (empty($_firstname) || empty($_lastname) || empty($_usermail) || empty($_password) || empty($_username)) {
        echo json_encode(["success" => false, "message" => "All fields are required!"]);
        exit;
    }
    if (strlen($_password) < 8) {
        echo json_encode(["success" => false, "message" => "Password must be at least 8 characters long!"]);
        exit;
    }
    if (!filter_var($_usermail, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Email invalid!"]);
        exit;
    }

    $_passwordhash = password_hash($_password, PASSWORD_DEFAULT);

    $sql = "SELECT id FROM users WHERE email = ? OR username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$_usermail, $_username]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Email or username already exists!"]);
        exit;
    }

    $sql  = "INSERT INTO users (username, firstname, lastname, email, password_hash) VALUES (?, ?, ?, ?, ?) RETURNING id";
    $stmt = $conn->prepare($sql);

    if (!$stmt->execute([$_username, $_firstname, $_lastname, $_usermail, $_passwordhash])) {
        echo json_encode(["success" => false, "message" => "Registration failed."]);
        exit;
    }

    $new_id       = $stmt->fetchColumn();
    $jwt_email    = $_usermail;
    $jwt_username = $_username;

    // ─── SHARED: Issue JWT & Session ──────────────────────────
    if (isset($new_id)) {
        $env    = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
        $secret = $env['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: '';
        $now    = time();
        $payload = [
            'sub'      => (string)$new_id,
            'email'    => $jwt_email,
            'username' => $jwt_username,
            'iat'      => $now,
            'exp'      => $now + 60 * 60 * 24 * 7
        ];
        $jwt    = jwt_encode($payload, $secret);
        $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
        setcookie('token', $jwt, [
            'expires'  => $payload['exp'],
            'path'     => '/',
            'secure'   => $secure,
            'httponly' => true,
            'samesite' => $secure ? 'None' : 'Lax'
        ]);

        $_SESSION["user_id"] = $new_id;

        echo json_encode([
            "success"  => true,
            "message"  => "Registration successful!",
            "user_id"  => $new_id,
            "username" => $jwt_username
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid option."]);
    }
}

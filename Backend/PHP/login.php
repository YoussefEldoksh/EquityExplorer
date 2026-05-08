<?php
session_start();
// CORS Headers (Required for React)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Handle Preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "db_connection.php";
require_once "auth_middleware.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = isset($_POST["usermail"]) ? trim($_POST["usermail"]) : "";
    $password = isset($_POST["userpass"]) ? trim($_POST["userpass"]) : "";
    
    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Email and password are required."]);
        exit;
    }

    $sql = "SELECT id, username, password_hash FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email]);

    if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (password_verify($password, $user["password_hash"])) {
            // Create JWT
            $env = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
            $secret = $env['JWT_SECRET'] ?? '';
            $now = time();
            $payload = [
                'sub' => $user['id'],
                'email' => $email,
                'username' => $user['username'],
                'iat' => $now,
                'exp' => $now + 60 * 60 * 24 * 7 // 7 days
            ];
            $jwt = jwt_encode($payload, $secret);

            // Set HttpOnly cookie
            $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
            setcookie('token', $jwt, [
                'expires' => $payload['exp'],
                'path' => '/',
                'secure' => $secure,
                'httponly' => true,
                'samesite' => 'Lax'
            ]);

            $_SESSION["user_id"] = $user["id"];

            echo json_encode([
                "success" => true,
                "message" => "Login successful!",
                "user" => [
                    "id" => $user["id"],
                    "username" => $user["username"],
                    "email" => $email
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Incorrect password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Account not found."]);
    }
}
?>
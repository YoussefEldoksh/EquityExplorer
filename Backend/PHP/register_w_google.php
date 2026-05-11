<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
require_once "db_connection.php";
require_once "auth_middleware.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read body — could be JSON (google) or form (normal)
    $rawInput = file_get_contents("php://input");
    $jsonData = json_decode($rawInput, true);
    // ─── GOOGLE ───────────────────────────────────────────────
        $email     = trim($jsonData['email']    ?? '');
        $name      = trim($jsonData['name']     ?? '');
        $google_id = trim($jsonData['googleId'] ?? '');

        error_log("Google register: email=$email, google_id=$google_id, name=$name");

        if (empty($email) || empty($google_id)) {
            echo json_encode(["success" => false, "message" => "Invalid Google data."]);
            exit;
        }

        // Check if user already exists
        $stmt = $conn->prepare("SELECT id, username FROM users WHERE email = ? OR google_id = ?");
        $stmt->execute([$email, $google_id]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            // Already exists — link google_id if not linked yet, then log in
            $user_id  = $existing['id'];
            $username = $existing['username'];

            $stmt = $conn->prepare("UPDATE users SET google_id = ? WHERE id = ? AND google_id IS NULL");
            $stmt->execute([$google_id, $user_id]);
        } else {
            // New Google user
            $nameParts = explode(' ', $name, 2);
            $firstname = $nameParts[0];
            $lastname  = $nameParts[1] ?? '';
            $username  = strtolower(str_replace(' ', '_', $name)) . '_' . rand(100, 999);

            $stmt = $conn->prepare(
                "INSERT INTO users (username, firstname, lastname, email, google_id, password_hash)
                 VALUES (?, ?, ?, ?, ?, NULL)"
            );

            if (!$stmt->execute([$username, $firstname, $lastname, $email, $google_id])) {
                echo json_encode(["success" => false, "message" => "Registration failed."]);
                exit;
            }

            $user_id = $conn->lastInsertId();
        }

        $jwt_email = $email;
        $jwt_username = $username;
        $new_id = $user_id;

            // ─── SHARED: Issue JWT & Session ──────────────────────────
    if (isset($new_id)) {
        $env    = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
        $secret = $env['JWT_SECRET'] ?? '';
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
            'samesite' => 'Lax'
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


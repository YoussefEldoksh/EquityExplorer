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
    $rawInput = file_get_contents("php://input");
    $jsonData = json_decode($rawInput, true);

    $email     = trim($jsonData['email']    ?? '');
    $name      = trim($jsonData['name']     ?? '');
    $google_id = trim($jsonData['googleId'] ?? '');

    if (empty($email) || empty($google_id)) {
        echo json_encode(["success" => false, "message" => "Invalid Google data."]);
        exit;
    }

    // Check if user already exists
    $stmt = $conn->prepare("SELECT id, username, google_id FROM users WHERE email = ? AND google_id = ?");
    $stmt->execute([$email, $google_id]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);


    if ($existing) {
        // Already exists — link google_id if not linked yet, then log in
        $user_id  = $existing['id'];
        $username = $existing['username'];
        $google_id_database = $existing['google_id'];

        if ($google_id_database === $google_id) {

            $env = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
            $secret = $env['JWT_SECRET'] ?? '';
            $now = time();
            $payload = [
                'sub' => (string)$user_id,
                'email' => $email,
                'username' => $username,
                'iat' => $now,
                'exp' => $now + 60 * 60 * 24 * 7 // 7 days
            ];
            $jwt = jwt_encode($payload, $secret);

            // Set HttpOnly cookie
            $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
            setcookie('token', $jwt, [
                'expires' => $payload['exp'],
                'path' => '/',
                'secure' => true,
                'httponly' => true,
                'samesite' => 'None'
            ]);

            $_SESSION["user_id"] = $user_id;

            echo json_encode([
                "success" => true,
                "message" => "Login successful!",
                "user" => [
                    "id" => $user_id,
                    "username" => $username,
                    "email" => $email
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Account not found."]);
        }

        // $stmt = $conn->prepare("UPDATE users SET google_id = ? WHERE id = ? AND google_id IS NULL");
        // $stmt->execute([$google_id, $user_id]);
    } else {
        echo json_encode(["success" => false, "message" => "Account not found."]);
    }

}


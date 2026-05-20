<?php
session_start();
header('Content-Type: application/json');

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

    // Check if user already exists by google_id OR email
    $stmt = $conn->prepare("SELECT id, username, google_id FROM users WHERE google_id = ? OR email = ?");
    $stmt->execute([$google_id, $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $userId = $user['id'];
        $username = $user['username'];
        // Link google_id if not linked yet
        $updateStmt = $conn->prepare("UPDATE users SET google_id = ? WHERE id = ? AND google_id IS NULL");
        $updateStmt->execute([$google_id, $userId]);
    } else {
        // Register new user
        $username = strtolower(str_replace(' ', '_', $name)) . '_' . rand(100, 999);
        $nameParts = explode(' ', $name, 2);
        $firstname = $nameParts[0];
        $lastname  = $nameParts[1] ?? '';

        $stmt = $conn->prepare(
            "INSERT INTO users (username, firstname, lastname, email, google_id, password_hash)
             VALUES (?, ?, ?, ?, ?, NULL)
             RETURNING id"
        );

        if (!$stmt->execute([$username, $firstname, $lastname, $email, $google_id])) {
            echo json_encode(["success" => false, "message" => "Registration failed."]);
            exit;
        }
        $userId = $stmt->fetchColumn();
    }

    // Issue JWT
    $secret = get_jwt_secret();
    $now = time();
    $payload = [
        'sub' => (string)$userId,
        'email' => $email,
        'username' => $username,
        'iat' => $now,
        'exp' => $now + 60 * 60 * 24 * 7 // 7 days
    ];
    $jwt = jwt_encode($payload, $secret);

    // Set HttpOnly cookie
    setcookie('token', $jwt, [
        'expires' => $payload['exp'],
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None'
    ]);

    $_SESSION["user_id"] = $userId;

    echo json_encode([
        "success" => true,
        "message" => "Logged in via Google",
        "username" => $username
    ]);
}
?>

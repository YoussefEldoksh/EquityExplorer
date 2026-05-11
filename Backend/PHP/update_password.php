<?php
// PHP script to set or update user password
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

require_once "db_connection.php";
require_once "auth_middleware.php";

$payload = require_auth();
$userId = $payload['sub'];

$jsonData = json_decode(file_get_contents("php://input"), true);
$newPassword = $jsonData['new_password'] ?? '';
$confirmPassword = $jsonData['confirm_password'] ?? '';
$oldPassword = $jsonData['old_password'] ?? ''; // Only required if user already has a password

if (empty($newPassword) || strlen($newPassword) < 6) {
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters."]);
    exit;
}

if ($newPassword !== $confirmPassword) {
    echo json_encode(["success" => false, "message" => "Passwords do not match."]);
    exit;
}

try {
    // Check if user already has a password
    $stmt = $conn->prepare("SELECT password_hash FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if ($user && !empty($user['password_hash'])) {
        // User has a password, they must provide the old one to change it
        if (empty($oldPassword)) {
            echo json_encode(["success" => false, "message" => "Current password is required to change password."]);
            exit;
        }
        if (!password_verify($oldPassword, $user['password_hash'])) {
            echo json_encode(["success" => false, "message" => "Current password is incorrect."]);
            exit;
        }
    }

    // Hash the new password
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update the database
    $stmt = $conn->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    if ($stmt->execute([$newHash, $userId])) {
        echo json_encode(["success" => true, "message" => "Password updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update password."]);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}

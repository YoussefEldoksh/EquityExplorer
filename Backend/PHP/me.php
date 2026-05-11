<?php
// CORS Headers (Required for React)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

// Verify the HttpOnly cookie and get payload
$payload = require_auth();
$userId = $payload['sub'];

try {
    // Fetch latest user data from database
    $stmt = $conn->prepare("SELECT id, username, firstname, lastname, email, bio, password_hash FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if ($user) {
        $has_password = !empty($user['password_hash']);
        unset($user['password_hash']); // Don't send the hash to frontend
        
        echo json_encode([
            "success" => true,
            "user" => $user,
            "has_password" => $has_password
        ]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "User not found"]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>

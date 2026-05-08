<?php
// CORS Headers (Required for React)
header("Access-Control-Allow-Origin: http://localhost:5173"); 
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

// Verify auth
$payload = require_auth();
$userId = $payload['sub'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON body or POST body
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }

    $firstname = isset($input['firstname']) ? trim($input['firstname']) : "";
    $lastname = isset($input['lastname']) ? trim($input['lastname']) : "";
    $email = isset($input['email']) ? trim($input['email']) : "";
    $bio = isset($input['bio']) ? trim($input['bio']) : "";

    // Simple validation
    if (empty($firstname) || empty($lastname) || empty($email)) {
        echo json_encode(["success" => false, "message" => "First name, last name, and email are required."]);
        exit;
    }

    try {
        // Update user record
        $stmt = $conn->prepare("UPDATE users SET firstname = ?, lastname = ?, email = ?, bio = ? WHERE id = ?");
        $success = $stmt->execute([$firstname, $lastname, $email, $bio, $userId]);

        if ($success) {
            echo json_encode(["success" => true, "message" => "Profile updated successfully!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update profile."]);
        }
    } catch (Throwable $e) {
        // Handle duplicate email etc.
        if (strpos($e->getMessage(), 'unique') !== false) {
            echo json_encode(["success" => false, "message" => "This email is already in use."]);
        } else {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    }
}
?>

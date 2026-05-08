<?php
// CORS Headers (Required for React)
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

// Handle Preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "auth_middleware.php";

// This will verify the HttpOnly cookie and return the JWT payload.
// If not authenticated, it will return a 401 response and exit.
$payload = require_auth();

echo json_encode([
    "success" => true,
    "user" => [
        "id" => $payload['sub'],
        "email" => $payload['email']
    ]
]);
?>

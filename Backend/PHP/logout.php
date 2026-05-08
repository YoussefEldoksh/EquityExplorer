<?php
//CORS Headers
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

//Handle Preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Destroy the Session
session_start();

// Unset all session variables
$_SESSION = array();

session_destroy();

// Clear auth cookie
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
setcookie('token', '', [
    'expires' => time() - 3600,
    'path' => '/',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax'
]);

//Send Response
echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
]);
?>
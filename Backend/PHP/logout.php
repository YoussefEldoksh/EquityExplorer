<?php
header('Content-Type: application/json');

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
    'secure' => true,
    'httponly' => true,
    'samesite' => 'None'
]);

//Send Response
echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
]);
?>
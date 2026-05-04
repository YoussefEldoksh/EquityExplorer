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

session_start(); 
require_once "db_connection.php"; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') { 
    $_username  = isset($_POST["username"]) ? trim($_POST["username"]) : "";
    $_firstname = isset($_POST["firstname"]) ? trim($_POST["firstname"]) : "";
    $_lastname  = isset($_POST["lastname"]) ? trim($_POST["lastname"]) : "";
    $_usermail  = isset($_POST["usermail"]) ? trim($_POST["usermail"]) : "";
    $_password  = isset($_POST["userpass"]) ? trim($_POST["userpass"]) : "";

    // Validation
    if (empty($_firstname) || empty($_lastname) || empty($_usermail) || empty($_password) || empty($_username)) {
        echo json_encode(["success" => false, "message" => "All fields are required!"]);
        exit;
    } 
    if (strlen($_password) < 8) {
        echo json_encode(["success" => false, "message" => "Password must be at least 8 characters long!"]);
        exit;
    }
    if (!filter_var($_usermail, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Email invalid!"]);
        exit;
    }

    $_passwordhash = password_hash($_password, PASSWORD_DEFAULT);
    
    // Check for existing user
    $sql = "SELECT id FROM users WHERE email = ? OR username = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $_usermail, $_username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if (mysqli_num_rows($result) > 0) {
        echo json_encode(["success" => false, "message" => "Email or username already exists!"]);
        exit;
    }
    
    // Insert new user
    $sql = "INSERT INTO users (username, firstname, lastname, email, password_hash) VALUES (?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sssss", $_username, $_firstname, $_lastname, $_usermail, $_passwordhash);
    
    if (mysqli_stmt_execute($stmt)) {
        $new_id = mysqli_insert_id($conn);
        $token = bin2hex(random_bytes(32));
        
        $_SESSION["user_id"] = $new_id;
        $_SESSION["token"] = $token;
        
        echo json_encode([
            "success" => true,
            "message" => "Registration successful!",
            "token" => $token,
            "user_id" => $new_id,
            "username" => $_username
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Registration failed."]);
    }
    mysqli_stmt_close($stmt);
}
?>
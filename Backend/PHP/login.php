<?php
session_start();
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = isset($_POST["usermail"]) ? trim($_POST["usermail"]) : "";
    $password = isset($_POST["userpass"]) ? trim($_POST["userpass"]) : "";
    
    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Email and password are required."]);
        exit;
    }

    $sql = "SELECT id, username, password_hash FROM users WHERE email = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($user = mysqli_fetch_assoc($result)) {
        if (password_verify($password, $user["password_hash"])) {
            $token = bin2hex(random_bytes(32));
            
            
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["token"] = $token;
            
            echo json_encode([
                "success" => true,
                "message" => "Login successful!",
                "token" => $token,
                "user" => [
                    "id" => $user["id"],
                    "username" => $user["username"],
                    "email" => $email
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Incorrect password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Account not found."]);
    }
    mysqli_stmt_close($stmt);
}
?>
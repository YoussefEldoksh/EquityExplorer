<?php
//Database configuration
$host = "localhost";
$username = "root";     
$password = "";         
$dbname = "EquityExplorer"; 

//Create connection
$conn = mysqli_connect($host, $username, $password, $dbname);

//Check connection
if (!$conn) {
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false, 
        "message" => "Database Connection Failed: " . mysqli_connect_error()
    ]);
    exit;
}
?>
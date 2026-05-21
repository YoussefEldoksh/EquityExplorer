<?php
session_start();
header('Content-Type: application/json');

require_once "db_connection.php";
require_once "auth_middleware.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents("php://input");
    $jsonData = json_decode($rawInput, true);

    $code = trim($jsonData['code'] ?? '');
    $redirectUri = trim($jsonData['redirect_uri'] ?? 'postmessage');

    if (empty($code)) {
        echo json_encode(["success" => false, "message" => "No code provided."]);
        exit;
    }

    $env = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
    $clientId = $env['GOOGLE_CLIENT_ID'] ?? getenv('GOOGLE_CLIENT_ID') ?: '';
    $clientSecret = $env['GOOGLE_CLIENT_SECRET'] ?? getenv('GOOGLE_CLIENT_SECRET') ?: '';

    if (empty($clientId) || empty($clientSecret)) {
        echo json_encode(["success" => false, "message" => "Google Client ID or Secret missing on server."]);
        exit;
    }

    // Exchange code for token
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'client_id' => $clientId,
        'client_secret' => $clientSecret,
        'code' => $code,
        'grant_type' => 'authorization_code',
        'redirect_uri' => $redirectUri
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    $rawResponse = curl_exec($ch);
    $response = json_decode($rawResponse, true);
    curl_close($ch);

    $accessToken = $response['access_token'] ?? null;

    if (!$accessToken) {
        $error = $response['error'] ?? 'Unknown error';
        $errorDesc = $response['error_description'] ?? 'No description';
        echo json_encode(["success" => false, "message" => "Google Error: $error - $errorDesc"]);
        exit;
    }

    // Get user info
    $ch = curl_init('https://www.googleapis.com/oauth2/v3/userinfo');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $accessToken
    ]);
    $userRes = curl_exec($ch);
    $userInfo = json_decode($userRes, true);
    curl_close($ch);

    $email = $userInfo['email'] ?? '';
    $name = $userInfo['name'] ?? '';
    $google_id = $userInfo['sub'] ?? '';

    if (empty($email) || empty($google_id)) {
        echo json_encode(["success" => false, "message" => "Failed to get user info from Google."]);
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
    $secret = $env['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: '';
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
    $secure = is_https();
    setcookie('token', $jwt, [
        'expires' => $payload['exp'],
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => $secure ? 'None' : 'Lax'
    ]);

    $_SESSION["user_id"] = $userId;

    echo json_encode([
        "success" => true,
        "message" => "Logged in via Google",
        "username" => $username
    ]);
}
?>

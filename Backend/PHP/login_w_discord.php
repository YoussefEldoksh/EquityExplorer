<?php
header('Content-Type: application/json');

require_once "db_connection.php";
require_once "auth_middleware.php";

// 1. Get the code from the frontend
$input = json_decode(file_get_contents("php://input"), true);
$code = $input['code'] ?? null;

if (!$code) {
    echo json_encode(['success' => false, 'message' => 'No code provided']);
    exit;
}

// 2. Load Discord Credentials from .env
$env = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
$clientId = $env['DISCORD_CLIENT_ID'] ?? getenv('DISCORD_CLIENT_ID') ?: '';
$clientSecret = $env['DISCORD_CLIENT_SECRET'] ?? getenv('DISCORD_CLIENT_SECRET') ?: '';
$jwtSecret = $env['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: '';

// 3. Exchange code for Access Token
$frontendRedirectUri = $input['redirect_uri'] ?? ''; 

$ch = curl_init('https://discord.com/api/oauth2/token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'grant_type' => 'authorization_code',
    'code' => $code,
    'redirect_uri' => $frontendRedirectUri
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
$rawResponse = curl_exec($ch);
$response = json_decode($rawResponse, true);
curl_close($ch);

$accessToken = $response['access_token'] ?? null;

if (!$accessToken) {
    $error = $response['error_description'] ?? ($response['error'] ?? 'Unknown error');
    echo json_encode([
        'success' => false, 
        'message' => "Discord Token Error: $error",
        'raw_discord_response' => $response
    ]);
    exit;
}

// 4. Get User Info from Discord
$ch = curl_init("https://discord.com/api/users/@me");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $accessToken
]);
$rawUser = curl_exec($ch);
$discordUser = json_decode($rawUser, true);
curl_close($ch);

$email = $discordUser['email'] ?? null;
$discordId = $discordUser['id'] ?? null;

if (!$discordId) {
    echo json_encode(['success' => false, 'message' => 'Discord ID not found in Discord response']);
    exit;
}

// Discord sometimes doesn't provide email if it's not verified or not in scope
if (!$email) {
    // If we absolutely need email, we might have to fail, but let's try to proceed with a fallback
    $email = $discordId . '@discord.user'; 
}

// 5. Database Logic (Login or Register)
try {
    // Check if user exists by discord_id OR email
    $stmt = $conn->prepare("SELECT id, username FROM users WHERE discord_id = ? OR email = ?");
    $stmt->execute([(string)$discordId, $email]);
    $user = $stmt->fetch();

    if ($user) {
        $userId = $user['id'];
        $username = $user['username'];
        // Link discord_id if not linked yet
        $updateStmt = $conn->prepare("UPDATE users SET discord_id = ? WHERE id = ? AND discord_id IS NULL");
        $updateStmt->execute([(string)$discordId, $userId]);
    } else {
        // Register new user
        $username = $discordUser['username'] ?? ('user_' . rand(100, 999));
        // Check if username already exists
        $checkStmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $checkStmt->execute([$username]);
        if ($checkStmt->fetch()) {
            $username .= '_' . rand(100, 999);
        }

        $firstname = $discordUser['global_name'] ?? $username;
        $lastname = '';

        $stmt = $conn->prepare("INSERT INTO users (username, firstname, lastname, email, discord_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$username, $firstname, $lastname, $email, (string)$discordId]);
        $userId = $conn->lastInsertId();
    }

    // 6. Issue JWT
    $payload = [
        'sub' => (string)$userId,
        'iat' => time(),
        'exp' => time() + (3600 * 24 * 7) // 1 week
    ];
    $token = jwt_encode($payload, $jwtSecret);

    setcookie('token', $token, [
        'expires' => time() + (3600 * 24 * 7),
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);

    echo json_encode(['success' => true, 'message' => 'Logged in via Discord', 'username' => $username]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>

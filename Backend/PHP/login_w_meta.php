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

// 2. Load Meta Credentials from .env
$env = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
$appId = $env['META_APP_ID'] ?? getenv('META_APP_ID') ?: '';
$appSecret = $env['META_APP_SECRET'] ?? getenv('META_APP_SECRET') ?: '';
$jwtSecret = $env['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: '';

// 3. Exchange code for Access Token
$frontendRedirectUri = $input['redirect_uri'] ?? ''; 

$ch = curl_init('https://graph.facebook.com/v18.0/oauth/access_token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'client_id' => $appId,
    'client_secret' => $appSecret,
    'code' => $code,
    'redirect_uri' => $frontendRedirectUri
]));
$rawResponse = curl_exec($ch);
$response = json_decode($rawResponse, true);
curl_close($ch);

$accessToken = $response['access_token'] ?? null;

if (!$accessToken) {
    $error = $response['error']['message'] ?? 'Unknown error';
    echo json_encode([
        'success' => false, 
        'message' => "Meta Token Error: $error",
        'raw_meta_response' => $response
    ]);
    exit;
}

// 4. Get User Info from Meta
$ch = curl_init("https://graph.facebook.com/me?fields=id,name,email,first_name,last_name&access_token=$accessToken");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$rawUser = curl_exec($ch);
$metaUser = json_decode($rawUser, true);
curl_close($ch);

$email = $metaUser['email'] ?? null;
$metaId = $metaUser['id'] ?? null;

if (!$email || !$metaId) {
    echo json_encode(['success' => false, 'message' => 'Email or Meta ID not found in Meta response']);
    exit;
}

// 5. Database Logic (Login or Register)
try {
    // Check if user exists by meta_id OR email
    $stmt = $conn->prepare("SELECT id, username FROM users WHERE meta_id = ? OR email = ?");
    $stmt->execute([(string)$metaId, $email]);
    $user = $stmt->fetch();

    if ($user) {
        $userId = $user['id'];
        // If they logged in by email, ensure the meta_id is now linked
        $updateStmt = $conn->prepare("UPDATE users SET meta_id = ? WHERE id = ? AND meta_id IS NULL");
        $updateStmt->execute([(string)$metaId, $userId]);
    } else {
        // Register new user
        $username = strtolower(str_replace(' ', '_', $metaUser['name'] ?? 'user')) . '_' . rand(100, 999);
        $firstname = $metaUser['first_name'] ?? ($metaUser['name'] ?? '');
        $lastname = $metaUser['last_name'] ?? '';

        $stmt = $conn->prepare("INSERT INTO users (username, firstname, lastname, email, meta_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$username, $firstname, $lastname, $email, (string)$metaId]);
        $userId = $conn->lastInsertId();
    }

    // 6. Issue JWT
    $payload = [
        'sub' => (string)$userId,
        'iat' => time(),
        'exp' => time() + (3600 * 24 * 7) // 1 week
    ];
    $token = jwt_encode($payload, $jwtSecret);

    // Set HttpOnly cookie
    setcookie('token', $token, [
        'expires' => time() + (3600 * 24 * 7),
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);

    echo json_encode(['success' => true, 'message' => 'Logged in via Meta', 'username' => $username ?? $user['username']]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>

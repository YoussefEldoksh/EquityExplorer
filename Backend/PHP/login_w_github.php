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

// 2. Load GitHub Credentials from .env
$env = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
$clientId = $env['GITHUB_CLIENT_ID'] ?? getenv('GITHUB_CLIENT_ID') ?: '';
$clientSecret = $env['GITHUB_CLIENT_SECRET'] ?? getenv('GITHUB_CLIENT_SECRET') ?: '';
$jwtSecret = $env['JWT_SECRET'] ?? getenv('JWT_SECRET') ?: '';

// 3. Exchange code for Access Token
$redirectUri = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
// We need to pass the same redirect_uri used in the frontend. 
// Since we are in an SPA, we can just derive it or pass it from frontend.
$frontendRedirectUri = $input['redirect_uri'] ?? ''; 

$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'code' => $code,
    'redirect_uri' => $frontendRedirectUri
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$rawResponse = curl_exec($ch);
$response = json_decode($rawResponse, true);
curl_close($ch);

$accessToken = $response['access_token'] ?? null;

if (!$accessToken) {
    $error = $response['error'] ?? 'Unknown error';
    $errorDesc = $response['error_description'] ?? 'No description provided';
    echo json_encode([
        'success' => false, 
        'message' => "GitHub Error: $error - $errorDesc",
        'raw_github_response' => $response // Temporary for debugging
    ]);
    exit;
}

// 4. Get User Info from GitHub
function fetchGithub($url, $token) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: token ' . $token,
        'User-Agent: EquityExplorer-App'
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    return json_decode($res, true);
}

$githubUser = fetchGithub('https://api.github.com/user', $accessToken);
$githubEmails = fetchGithub('https://api.github.com/user/emails', $accessToken);

// Find primary email
$email = null;
foreach ($githubEmails as $e) {
    if ($e['primary'] && $e['verified']) {
        $email = $e['email'];
        break;
    }
}

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Primary verified email not found on GitHub']);
    exit;
}

// 5. Database Logic (Login or Register)
try {
    // Check if user exists by github_id OR email
    $stmt = $conn->prepare("SELECT id, username FROM users WHERE github_id = ? OR email = ?");
    $stmt->execute([(string)$githubUser['id'], $email]);
    $user = $stmt->fetch();

    if ($user) {
        $userId = $user['id'];
        // If they logged in by email, ensure the github_id is now linked
        $updateStmt = $conn->prepare("UPDATE users SET github_id = ? WHERE id = ? AND github_id IS NULL");
        $updateStmt->execute([(string)$githubUser['id'], $userId]);
    } else {
        // Register new user
        $username = $githubUser['login'] ?? explode('@', $email)[0];
        $fullname = $githubUser['name'] ?? $username;
        $names = explode(' ', $fullname, 2);
        $firstname = $names[0];
        $lastname = $names[1] ?? '';

        $stmt = $conn->prepare("INSERT INTO users (username, firstname, lastname, email, github_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$username, $firstname, $lastname, $email, (string)$githubUser['id']]);
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
        'domain' => '', 
        'secure' => true,
        'httponly' => true,
        'samesite' => 'None',
    ]);

    echo json_encode(['success' => true, 'message' => 'Logged in via GitHub']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>

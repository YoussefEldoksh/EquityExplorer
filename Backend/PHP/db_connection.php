<?php
// Dynamic CORS handling
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if origin is allowed
$isVercel = preg_match('/\.vercel\.app$/', parse_url($origin, PHP_URL_HOST) ?? '');
$isLocal = preg_match('/^http:\/\/(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/', $origin);

if ($isVercel || $isLocal || empty($origin)) {
    // If empty origin, we still allow it for same-origin/proxied requests
    $headerOrigin = $origin ?: 'https://equityexplorer.vercel.app';
    header("Access-Control-Allow-Origin: $headerOrigin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Try to load from .env file first, then fallback to getenv()
$envPath = __DIR__ . '/.env';
$env = [];
if (is_readable($envPath)) {
    $env = parse_ini_file($envPath);
}

$host = $env['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
$port = $env['DB_PORT'] ?? getenv('DB_PORT') ?: '5432';
$dbname = $env['DB_NAME'] ?? getenv('DB_NAME') ?: '';
$username = $env['DB_USER'] ?? getenv('DB_USER') ?: '';
$password = $env['DB_PASS'] ?? getenv('DB_PASS') ?: '';

// Check if PDO pgsql driver is installed
if (!in_array('pgsql', PDO::getAvailableDrivers())) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Backend Error: PDO PostgreSQL driver is not enabled in your PHP configuration. Please enable extension=pdo_pgsql in your php.ini.'
    ]);
    exit;
}

try {
    $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $host, $port, $dbname);

    $conn = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (Throwable $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database Connection Failed: ' . $e->getMessage(),
    ]);
    exit;
}

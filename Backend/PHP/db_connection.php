<?php
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

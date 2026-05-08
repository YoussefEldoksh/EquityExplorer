<?php
$envPath = __DIR__ . '/.env';
if (!is_readable($envPath)) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Backend Error: .env file is missing. Please copy .env.example to .env and fill in your credentials.'
    ]);
    exit;
}

$env = parse_ini_file($envPath);
$env = $env === false ? [] : $env;

$host = trim($env['DB_HOST'] ?? 'localhost');
$port = trim($env['DB_PORT'] ?? '5432');
$dbname = trim($env['DB_NAME'] ?? '');
$username = $env['DB_USER'] ?? '';
$password = $env['DB_PASS'] ?? '';

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

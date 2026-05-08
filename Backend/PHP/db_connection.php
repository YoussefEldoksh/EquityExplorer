<?php
$envPath = __DIR__ . '/.env';
$env = is_readable($envPath) ? parse_ini_file($envPath) : [];
$env = $env === false ? [] : $env;

$host = trim($env['DB_HOST'] ?? 'localhost');
$port = trim($env['DB_PORT'] ?? '5432');
$dbname = trim($env['DB_NAME'] ?? '');
$username = $env['DB_USER'] ?? '';
$password = $env['DB_PASS'] ?? '';

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

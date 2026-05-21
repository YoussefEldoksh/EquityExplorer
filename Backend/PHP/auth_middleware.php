<?php
// Simple JWT helpers and middleware for cookie-based auth (HS256)

/**
 * Detect HTTPS even behind a reverse proxy (Render, Nginx, etc.)
 * Render terminates TLS at the proxy, so PHP never sees HTTPS=on.
 * The proxy sets X-Forwarded-Proto: https instead.
 */
function is_https(): bool {
    // Direct HTTPS
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') return true;
    // Behind reverse proxy (Render / Nginx / Cloudflare)
    if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') return true;
    // Render also sometimes sets this
    if (isset($_SERVER['HTTP_X_FORWARDED_SSL']) && $_SERVER['HTTP_X_FORWARDED_SSL'] === 'on') return true;
    return false;
}
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode(array $payload, string $secret, string $alg = 'HS256') {
    $header = ['typ' => 'JWT', 'alg' => $alg];
    $segments = [];
    $segments[] = base64url_encode(json_encode($header));
    $segments[] = base64url_encode(json_encode($payload));
    $signing_input = implode('.', $segments);
    $sig = '';
    if ($alg === 'HS256') {
        $sig = hash_hmac('sha256', $signing_input, $secret, true);
    } else {
        throw new Exception('Unsupported alg');
    }
    $segments[] = base64url_encode($sig);
    return implode('.', $segments);
}

function jwt_decode(string $jwt, string $secret, array $allowed_algs = ['HS256']) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) throw new Exception('Invalid token');
    [$headb, $payloadb, $cryptob] = $parts;
    $header = json_decode(base64url_decode($headb), true);
    $payload = json_decode(base64url_decode($payloadb), true);
    $signature = base64url_decode($cryptob);
    if (empty($header['alg']) || !in_array($header['alg'], $allowed_algs, true)) {
        throw new Exception('Unsupported alg');
    }
    $signing_input = $headb . '.' . $payloadb;
    $expected = '';
    if ($header['alg'] === 'HS256') {
        $expected = hash_hmac('sha256', $signing_input, $secret, true);
    }
    if (!hash_equals($expected, $signature)) {
        throw new Exception('Signature verification failed');
    }
    // expiry
    if (isset($payload['exp']) && time() >= $payload['exp']) {
        throw new Exception('Token expired');
    }
    return $payload;
}

function get_jwt_secret(): string {
    // Prefer runtime environment (Render) over local .env fallback
    $fromEnv = getenv('JWT_SECRET') ?: $_SERVER['JWT_SECRET'] ?? $_ENV['JWT_SECRET'] ?? '';
    if (!empty($fromEnv)) {
        return trim($fromEnv, "\"'");
    }
    $env = is_readable(__DIR__ . '/.env') ? parse_ini_file(__DIR__ . '/.env') : [];
    return trim((string)($env['JWT_SECRET'] ?? ''), "\"'");
}

function require_auth() {
    global $conn;
    $secret = get_jwt_secret();
    if (!$secret) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server misconfigured (missing JWT secret)']);
        exit;
    }
    $token = $_COOKIE['token'] ?? null;
    if (!$token) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit;
    }
    try {
        $payload = jwt_decode($token, $secret);
        $sub = isset($payload['sub']) ? (string)$payload['sub'] : '';
        if (!preg_match('/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/', $sub)) {
            throw new Exception('Session expired, please sign in again');
        }
        // Set RLS context for defense-in-depth
        if ($conn && isset($payload['sub'])) {
            setUserContext($conn, $payload['sub']); // payload['sub'] is now UUID string
        }
        return $payload;
    } catch (Throwable $e) {
        $secure = is_https();
        setcookie('token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'secure' => $secure,
            'httponly' => true,
            'samesite' => $secure ? 'None' : 'Lax'
        ]);
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid token: ' . $e->getMessage()]);
        exit;
    }
}

?>
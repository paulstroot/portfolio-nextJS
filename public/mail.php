<?php
declare(strict_types=1);

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$configPath = __DIR__ . '/mail-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(["error" => "Missing mail-config.php"]);
    exit;
}
require $configPath;

function escape_html(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

function is_valid_email(string $email): bool
{
    return strlen($email) <= 254 && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Defense in depth: strip control characters (CR/LF in particular) from any
// value that ends up in an email header or header-like field (subject,
// display name), so a crafted value can't inject extra header lines even if
// the upstream API were to reflect it verbatim into a raw header.
function strip_header_unsafe(string $text): string
{
    return preg_replace('/[\x00-\x1F\x7F]/', '', $text) ?? '';
}

/**
 * Minimal file-based rate limiter: one submission per IP per $windowSeconds.
 * Stored in the system temp dir (outside the web root) so it can't be fetched
 * directly, and keyed by a hash of the IP rather than the IP itself.
 */
function rate_limit_ok(string $ip, int $windowSeconds = 30): bool
{
    $path = sys_get_temp_dir() . '/paulstroot-contact-ratelimit.json';
    $fp = @fopen($path, 'c+');
    if ($fp === false) {
        return true; // fail open: an unwritable temp dir shouldn't block real visitors
    }

    flock($fp, LOCK_EX);
    $raw = stream_get_contents($fp);
    $data = json_decode($raw ?: '', true);
    if (!is_array($data)) {
        $data = [];
    }

    $now = time();
    foreach ($data as $key => $timestamp) {
        if (!is_int($timestamp) || $now - $timestamp > 3600) {
            unset($data[$key]);
        }
    }

    $key = hash('sha256', $ip);
    $allowed = !isset($data[$key]) || ($now - $data[$key]) >= $windowSeconds;
    if ($allowed) {
        $data[$key] = $now;
    }

    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($data));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);

    return $allowed;
}

if (!defined('SMTP2GO_API_KEY') || SMTP2GO_API_KEY === '') {
    http_response_code(500);
    echo json_encode(["error" => "Missing SMTP2GO_API_KEY configuration"]);
    exit;
}
if (!defined('CONTACT_TO_EMAIL') || CONTACT_TO_EMAIL === '') {
    http_response_code(500);
    echo json_encode(["error" => "Missing CONTACT_TO_EMAIL configuration"]);
    exit;
}
if (!defined('CONTACT_FROM_EMAIL') || CONTACT_FROM_EMAIL === '') {
    http_response_code(500);
    echo json_encode(["error" => "Missing CONTACT_FROM_EMAIL configuration"]);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON body"]);
    exit;
}

// Honeypot: real visitors never see or fill this field (it's hidden off-screen
// in the form). A non-empty value means something filled in every field it
// could find, i.e. a bot. Respond as if it worked so there's no signal to
// learn from and no incentive to keep retrying.
if (!empty($body['hp_field'])) {
    http_response_code(200);
    echo json_encode(["ok" => true]);
    exit;
}

$ip = is_string($_SERVER['REMOTE_ADDR'] ?? null) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
if (!rate_limit_ok($ip)) {
    http_response_code(429);
    echo json_encode(["error" => "Too many requests. Please wait a moment and try again."]);
    exit;
}

// Only ever trust these three fields from the client. The "to"/"from"
// addresses and subject are fixed server-side below — a visitor's request
// can never redirect where mail goes or who it appears to come from.
$errors = [];

$name = $body['name'] ?? null;
if (!is_string($name) || trim($name) === '') {
    $errors[] = "Missing or invalid 'name' field";
} elseif (strlen($name) > 200) {
    $errors[] = "'name' exceeds maximum length";
}

$email = $body['email'] ?? null;
if (!is_string($email) || trim($email) === '') {
    $errors[] = "Missing or invalid 'email' field";
} elseif (!is_valid_email(trim($email))) {
    $errors[] = "Invalid 'email' format";
}

$message = $body['message'] ?? null;
if (!is_string($message) || trim($message) === '') {
    $errors[] = "Missing or invalid 'message' field";
} elseif (strlen($message) > 10000) {
    $errors[] = "'message' exceeds maximum length";
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["error" => "Validation failed", "details" => $errors]);
    exit;
}

$visitorName = escape_html(strip_header_unsafe(substr(trim($name), 0, 200)));
$visitorEmail = strtolower(trim($email));
$visitorMessage = escape_html(trim($message));

$toName = defined('CONTACT_TO_NAME') ? (string) CONTACT_TO_NAME : '';
$toFormatted = $toName !== '' ? "$toName <" . CONTACT_TO_EMAIL . ">" : "<" . CONTACT_TO_EMAIL . ">";

$payload = [
    "api_key" => SMTP2GO_API_KEY,
    "sender" => CONTACT_FROM_EMAIL,
    "to" => [$toFormatted],
    "subject" => "Portfolio contact form: $visitorName",
    "text_body" => "Name: $visitorName\nEmail: $visitorEmail\n\n$visitorMessage",
    "custom_headers" => [
        ["header" => "Reply-To", "value" => "$visitorName <$visitorEmail>"],
    ],
];

$ch = curl_init("https://api.smtp2go.com/v3/email/send");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 15,
]);
$response = curl_exec($ch);
$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

if ($response === false || $httpStatus >= 400) {
    error_log("/mail.php error: " . $curlError . " status=" . $httpStatus . " body=" . $response);
    http_response_code(500);
    echo json_encode(["error" => "Failed to send email. Please try again later."]);
    exit;
}

http_response_code(200);
echo json_encode(["ok" => true, "result" => json_decode($response, true)]);

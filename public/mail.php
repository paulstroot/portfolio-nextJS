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

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON body"]);
    exit;
}

$errors = [];

$to = $body['to'] ?? null;
if (!is_array($to) || empty($to['email']) || !is_string($to['email'])) {
    $errors[] = "Missing or invalid 'to.email' field";
} elseif (!is_valid_email($to['email'])) {
    $errors[] = "Invalid 'to.email' format";
}
if (isset($to['name']) && !is_string($to['name'])) {
    $errors[] = "Invalid 'to.name' field type";
}

$from = $body['from'] ?? null;
if (!is_array($from) || empty($from['email']) || !is_string($from['email'])) {
    $errors[] = "Missing or invalid 'from.email' field";
} elseif (!is_valid_email($from['email'])) {
    $errors[] = "Invalid 'from.email' format";
}

$subject = $body['subject'] ?? null;
if (!is_string($subject) || $subject === '') {
    $errors[] = "Missing or invalid 'subject' field";
} elseif (strlen($subject) > 255) {
    $errors[] = "Subject exceeds maximum length (255 characters)";
}

$text = $body['text'] ?? null;
if (!is_string($text) || $text === '') {
    $errors[] = "Missing or invalid 'text' field";
} elseif (strlen($text) > 100000) {
    $errors[] = "Text body exceeds maximum length";
}

$html = $body['html'] ?? null;
if ($html !== null) {
    if (!is_string($html)) {
        $errors[] = "Invalid 'html' field type";
    } elseif (strlen($html) > 100000) {
        $errors[] = "HTML body exceeds maximum length";
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(["error" => "Validation failed", "details" => $errors]);
    exit;
}

if (!defined('SMTP2GO_API_KEY') || SMTP2GO_API_KEY === '') {
    http_response_code(500);
    echo json_encode(["error" => "Missing SMTP2GO_API_KEY configuration"]);
    exit;
}

$toEmail = strtolower(trim($to['email']));
$toName = isset($to['name']) ? escape_html(substr(trim((string) $to['name']), 0, 100)) : null;
$fromEmail = strtolower(trim($from['email']));
$sanitizedSubject = escape_html(substr(trim($subject), 0, 255));
$sanitizedText = escape_html(trim($text));
$sanitizedHtml = $html ? escape_html(trim($html)) : null;

$toFormatted = $toName ? "$toName <$toEmail>" : "<$toEmail>";

$payload = [
    "api_key" => SMTP2GO_API_KEY,
    "sender" => "<$fromEmail>",
    "to" => [$toFormatted],
    "subject" => $sanitizedSubject,
    "text_body" => $sanitizedText,
];
if ($sanitizedHtml) {
    $payload["html_body"] = $sanitizedHtml;
}

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

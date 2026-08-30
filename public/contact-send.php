<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$to = 'director@presenciavirtual.net';

function clean_field(string $value): string
{
    // Strip CR/LF so nothing here can inject extra mail headers.
    return trim(str_replace(["\r", "\n"], '', $value));
}

$name = clean_field($_POST['name'] ?? '');
$email = clean_field($_POST['email'] ?? '');
$phone = clean_field($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');
$honeypot = trim($_POST['website'] ?? '');

// Honeypot: only bots fill this hidden field. Pretend success, send nothing.
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_input']);
    exit;
}

$subject = mb_encode_mimeheader("Nuevo mensaje de contacto — {$name}", 'UTF-8');

$body = "Nombre: {$name}\n"
    . "Email: {$email}\n"
    . 'Teléfono: ' . ($phone !== '' ? $phone : 'No proporcionado') . "\n\n"
    . "Mensaje:\n{$message}\n";

$headers = [
    'From: Presencia Virtual <no-reply@presenciavirtual.net>',
    "Reply-To: {$email}",
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}

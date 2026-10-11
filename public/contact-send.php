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

$valid_topics = [
    'general' => 'Consulta general',
    'domain'  => 'Registro de dominios',
    'hosting' => 'Hosting web',
    'web'     => 'Desarrollo web',
    'ai'      => 'Consultoría de IA',
];

$name = clean_field($_POST['name'] ?? '');
$email = clean_field($_POST['email'] ?? '');
$phone = clean_field($_POST['phone'] ?? '');
$raw_topic = strtolower(clean_field($_POST['topic'] ?? ''));
$topic = array_key_exists($raw_topic, $valid_topics) ? $raw_topic : 'general';
$topic_label = $valid_topics[$topic];
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

$subject = mb_encode_mimeheader("Nuevo mensaje [{$topic_label}] — {$name}", 'UTF-8');

$body = "Nombre: {$name}\n"
    . "Email: {$email}\n"
    . 'Teléfono: ' . ($phone !== '' ? $phone : 'No proporcionado') . "\n"
    . "Tema: {$topic_label} ({$topic})\n\n"
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

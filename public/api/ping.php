<?php
declare(strict_types=1);

// Diagnostic endpoint. It exists to answer one question from the outside:
// did this /api/ directory actually reach the server, and can it read its
// config? Compare /api/ping.php with /api/domain-check.php:
//
//   both 404           -> the /api/ directory (or the file upload) never arrived
//   ping 200, check 404 -> only domain-check.php is missing or blocked
//   ping 200 with config present -> deployment is fine; the problem is upstream
//
// It never returns credentials or upstream responses, only booleans.
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

$configFile = __DIR__ . '/config.php';
$config = null;
if (is_file($configFile)) {
    $loaded = require $configFile;
    $config = is_array($loaded) ? $loaded : null;
}

$checks = [
    'php_version' => PHP_VERSION,
    'api_dir' => basename(__DIR__),
    'config_present' => $config !== null,
    'config_keys' => $config === null ? [] : array_keys($config),
    'has_username' => $config !== null && !empty($config['api_username']),
    'has_password' => $config !== null && !empty($config['api_password']),
    'curl' => function_exists('curl_init'),
    'allow_url_fopen' => (bool) ini_get('allow_url_fopen'),
    'openssl' => extension_loaded('openssl'),
    'openssl_version' => defined('OPENSSL_VERSION_TEXT') ? OPENSSL_VERSION_TEXT : null,
    'tmp_dir_writable' => is_writable(sys_get_temp_dir()),
    'https_wrapper' => in_array('https', stream_get_wrappers(), true),
    'flock' => function_exists('flock'),
];

echo json_encode(['ok' => true, 'checks' => $checks], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

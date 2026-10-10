<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    respond(503, ['ok' => false, 'error' => 'not_configured']);
}
$config = require $configFile;

// --- Input validation -------------------------------------------------------

$name = strtolower(trim((string) ($_GET['name'] ?? '')));
if (!preg_match('/^(?!-)[a-z0-9-]{1,63}(?<!-)$/', $name)) {
    respond(422, ['ok' => false, 'error' => 'invalid_name']);
}

$allowed = array_keys($config['tld_prices']);
$requested = array_values(array_intersect(array_filter(array_map('trim', explode(',', strtolower((string) ($_GET['tlds'] ?? ''))))), $allowed));
// The requested TLD comes first; the popular ones are added as alternatives.
$tlds = array_slice(array_values(array_unique(array_merge($requested, $config['default_tlds']))), 0, 12);
if (!$tlds) {
    respond(422, ['ok' => false, 'error' => 'invalid_tld']);
}

// --- Per-IP rate limit (file based, works on shared hosting) ----------------

function rate_limited(string $ip, int $max, int $windowSeconds): bool
{
    $file = sys_get_temp_dir() . '/pv_dc_rl_' . md5($ip);
    $now = time();
    $hits = [];
    if (is_file($file)) {
        $hits = array_filter(
            array_map('intval', file($file, FILE_IGNORE_NEW_LINES) ?: []),
            fn (int $ts): bool => $ts > $now - $windowSeconds
        );
    }
    if (count($hits) >= $max) {
        return true;
    }
    $hits[] = $now;
    file_put_contents($file, implode("\n", $hits), LOCK_EX);
    return false;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (rate_limited($ip, (int) $config['rate_limit_per_minute'], 60)) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

// --- ResellersPanel adapter -------------------------------------------------
// Isolated on purpose: this is the only place that knows the API's shape.
// The docs do not spell out the sub-fields of the `check` result, so parsing is
// tolerant. Returns [tld => bool|null]; null means "could not be determined".

function normalize_status($value): ?bool
{
    if (is_array($value)) {
        foreach (['available', 'status', 'result'] as $key) {
            if (array_key_exists($key, $value)) {
                return normalize_status($value[$key]);
            }
        }
        return null;
    }
    if (is_bool($value)) {
        return $value;
    }
    $text = strtolower((string) $value);
    if (in_array($text, ['1', 'true', 'yes', 'available', 'free'], true)) {
        return true;
    }
    if (in_array($text, ['0', 'false', 'no', 'taken', 'unavailable', 'registered'], true)) {
        return false;
    }
    return null;
}

function resellerspanel_check(array $config, string $name, array $tlds): array
{
    $query = http_build_query([
        'auth_username' => $config['api_username'],
        'auth_password' => $config['api_password'],
        'section' => 'domains',
        'command' => 'check',
        'return_type' => 'serialization',
        'name' => $name,
        'tlds' => $tlds,
    ]);

    $ctx = stream_context_create(['http' => ['method' => 'GET', 'timeout' => 8, 'ignore_errors' => true]]);
    $raw = @file_get_contents(rtrim($config['api_url'], '/') . '/?' . $query, false, $ctx);
    if ($raw === false) {
        throw new RuntimeException('upstream_unreachable');
    }

    $data = @unserialize($raw, ['allowed_classes' => false]);
    if (!is_array($data) || (int) ($data['error_code'] ?? 1) !== 0) {
        throw new RuntimeException('upstream_error');
    }

    $out = array_fill_keys($tlds, null);
    foreach ((array) ($data['result'] ?? []) as $key => $value) {
        // Entries may be keyed by TLD ("com" => ...) or be rows with a tld field.
        $tld = is_string($key) ? ltrim(strtolower($key), '.') : null;
        if (is_array($value) && isset($value['tld'])) {
            $tld = ltrim(strtolower((string) $value['tld']), '.');
        }
        if ($tld !== null && array_key_exists($tld, $out)) {
            $out[$tld] = normalize_status($value);
        }
    }
    return $out;
}

// --- Cache (short-lived) ----------------------------------------------------

$cacheFile = sys_get_temp_dir() . '/pv_dc_' . md5($name . '|' . implode(',', $tlds)) . '.json';
$statuses = null;
if (is_file($cacheFile) && filemtime($cacheFile) > time() - (int) $config['cache_seconds']) {
    $statuses = json_decode((string) file_get_contents($cacheFile), true);
}

if (!is_array($statuses)) {
    try {
        $statuses = resellerspanel_check($config, $name, $tlds);
    } catch (RuntimeException $e) {
        respond(502, ['ok' => false, 'error' => $e->getMessage()]);
    }
    file_put_contents($cacheFile, json_encode($statuses), LOCK_EX);
}

$results = [];
foreach ($tlds as $tld) {
    $domain = $name . '.' . $tld;
    $results[] = [
        'domain' => $domain,
        'tld' => $tld,
        'available' => $statuses[$tld] ?? null,
        'price' => $config['tld_prices'][$tld],
        'currency' => $config['currency'],
        'registerUrl' => str_replace('{domain}', rawurlencode($domain), (string) $config['order_url']),
    ];
}

respond(200, ['ok' => true, 'name' => $name, 'results' => $results]);

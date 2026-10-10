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

// --- ResellersPanel adapter -------------------------------------------------
// The only code that knows the API's shape. Single endpoint, query-string
// commands, PHP-serialized responses.

function rp_call(array $config, array $params): array
{
    $query = http_build_query(array_merge([
        'auth_username' => $config['api_username'],
        'auth_password' => $config['api_password'],
        'return_type' => 'serialization',
    ], $params));

    $ctx = stream_context_create(['http' => ['method' => 'GET', 'timeout' => 8, 'ignore_errors' => true]]);
    $raw = @file_get_contents(rtrim($config['api_url'], '/') . '/?' . $query, false, $ctx);
    if ($raw === false) {
        throw new RuntimeException('upstream_unreachable');
    }
    $data = @unserialize($raw, ['allowed_classes' => false]);
    // Single-command responses come wrapped under index 1.
    if (is_array($data) && isset($data[1]) && is_array($data[1])) {
        $data = $data[1];
    }
    if (!is_array($data) || (int) ($data['error_code'] ?? 1) !== 0) {
        throw new RuntimeException('upstream_error');
    }
    return $data;
}

function cached(string $key, int $seconds, callable $load): array
{
    $file = sys_get_temp_dir() . '/pv_dc_' . md5($key) . '.json';
    if (is_file($file) && filemtime($file) > time() - $seconds) {
        $data = json_decode((string) file_get_contents($file), true);
        if (is_array($data)) {
            return $data;
        }
    }
    $data = $load();
    file_put_contents($file, json_encode($data), LOCK_EX);
    return $data;
}

// Offered TLDs with their 12-month USD price; a first-year promo price wins when present.
function rp_prices(array $config): array
{
    $data = rp_call($config, [
        'section' => 'products',
        'command' => 'get_registerdomains',
        'currencies' => ['USD'],
        'periods' => [12],
        'prices' => ['price'],
        'active' => 1,
    ]);

    $out = [];
    foreach ((array) ($data['registerdomains'] ?? []) as $tld => $product) {
        if (!is_array($product) || !isset($product['prices'])) {
            continue;
        }
        $price = (float) $product['prices'];
        $promo = null;
        foreach ((array) ($product['promotions'] ?? []) as $p) {
            if (($p['promo_type'] ?? '') === 'register' && isset($p['prices']) && (float) $p['prices'] > 0) {
                $promo = $promo === null ? (float) $p['prices'] : min($promo, (float) $p['prices']);
            }
        }
        $tld = strtolower(str_replace('_', '.', (string) $tld));
        $out[$tld] = ['price' => $promo ?? $price, 'regular' => $price, 'promo' => $promo !== null];
    }
    return $out;
}

// Result is keyed by TLD: 1 = registered, 0 = available. TLDs the store
// does not sell are omitted from the response.
function rp_check(array $config, string $name, array $tlds): array
{
    $data = rp_call($config, [
        'section' => 'domains',
        'command' => 'check',
        'name' => $name,
        'tlds' => array_map(fn (string $t): string => $t, $tlds),
    ]);

    $out = [];
    foreach ((array) ($data['result'] ?? []) as $tld => $taken) {
        $out[strtolower((string) $tld)] = ((string) $taken) === '0';
    }
    return $out;
}

// --- Input validation -------------------------------------------------------

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (rate_limited($ip, (int) $config['rate_limit_per_minute'], 60)) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

$name = strtolower(trim((string) ($_GET['name'] ?? '')));
if (!preg_match('/^(?!-)[a-z0-9-]{1,63}(?<!-)$/', $name)) {
    respond(422, ['ok' => false, 'error' => 'invalid_name']);
}

try {
    $prices = cached('prices', (int) $config['price_cache_seconds'], fn () => rp_prices($config));

    // The requested TLD (if offered) comes first, then the popular ones as alternatives.
    $requested = array_filter(array_map('trim', explode(',', strtolower((string) ($_GET['tlds'] ?? '')))));
    $wanted = array_merge($requested, $config['default_tlds']);
    $tlds = array_slice(array_values(array_unique(array_filter($wanted, fn ($t) => isset($prices[$t])))), 0, 12);
    if (!$tlds) {
        respond(422, ['ok' => false, 'error' => 'invalid_tld']);
    }

    sort($tlds);
    $statuses = cached("check|$name|" . implode(',', $tlds), (int) $config['check_cache_seconds'], fn () => rp_check($config, $name, $tlds));
} catch (RuntimeException $e) {
    respond(502, ['ok' => false, 'error' => $e->getMessage()]);
}

// Keep the requested TLD first in the response.
usort($tlds, fn ($a, $b) => [in_array($a, $requested, true) ? 0 : 1, array_search($a, $config['default_tlds'])]
    <=> [in_array($b, $requested, true) ? 0 : 1, array_search($b, $config['default_tlds'])]);

$results = [];
foreach ($tlds as $tld) {
    $domain = $name . '.' . $tld;
    $results[] = [
        'domain' => $domain,
        'tld' => $tld,
        'available' => $statuses[$tld] ?? null,
        'price' => $prices[$tld]['price'],
        'regularPrice' => $prices[$tld]['regular'],
        'promo' => $prices[$tld]['promo'],
        'currency' => 'USD',
        'registerUrl' => str_replace('{name}', rawurlencode($name), (string) $config['order_url']),
    ];
}

respond(200, ['ok' => true, 'name' => $name, 'results' => $results]);

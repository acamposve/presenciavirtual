<?php
// Copy to config.php on the server and fill in the password. config.php is git-ignored.
return [
    'api_url' => 'https://api.duoservers.com',
    'api_username' => 'pvirtual',
    'api_password' => 'YOUR-RESELLER-PASSWORD',

    // Where the "Register" button sends the customer. {name} is replaced (URL-encoded).
    'order_url' => 'https://pvirtual.duoservers.com/dominios/resultados/?sld={name}',

    // Shown first / used as alternatives. Only TLDs the store offers are used.
    'default_tlds' => ['com', 'net', 'org', 'io', 'info'],

    'price_cache_seconds' => 3600,
    'check_cache_seconds' => 60,
    'rate_limit_per_minute' => 20,
];

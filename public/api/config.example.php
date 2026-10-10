<?php
// Copy to config.php on the server and fill in the values. config.php is git-ignored.
return [
    // Hostname issued in your ResellersPanel Reseller Control Panel (API section).
    'api_url' => 'https://YOUR-RESELLERSPANEL-API-HOST',
    'api_username' => 'your-store-name',
    'api_password' => 'your-api-password',

    // Where the "Register" button sends the customer. {domain} is replaced (URL-encoded).
    'order_url' => 'https://YOUR-RESELLERSPANEL-ORDER-FORM/?domain={domain}',

    'currency' => 'USD',
    // Allow-list of TLDs and the yearly price shown to visitors.
    'tld_prices' => [
        'com' => 14.99,
        'net' => 16.99,
        'org' => 15.99,
        'io' => 49.99,
        'uy' => 40.00,
        'com.uy' => 35.00,
    ],
    'default_tlds' => ['com', 'net', 'org', 'com.uy'],

    'cache_seconds' => 300,
    'rate_limit_per_minute' => 20,
];

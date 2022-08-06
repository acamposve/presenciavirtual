<?php

/**
 * Class with (default) settings.
 */
class WP24_Domain_Check_Options {

	/**
	 * @var object Options instance.
	 */
	private static $instance = null;
	/**
	 * @var array Default options.
	 */
	private $options_default;

	/**
	 * Constructor.
	 * 
	 * @return void
	 */
	private function __construct() {
		// init default options
		$this->options_default = array(
			'fieldLabel'			=> 'www.',
			'fieldPlaceholder'		=> __( 'desired-domain', 'wp24-domaincheck' ),
			'fieldWidth'			=> 250,
			'fieldUnit'				=> 'px',
			'fieldnameDomain'		=> 'domaincheck_domain',
			'fieldnameTld'			=> 'domaincheck_tld',
			'selectionType'			=> 'dropdown',
			'tlds'					=> 'com, net, org, info, eu, tk, de, uk, nl, ru, br, fr, it, ca, pl',
			'checkAll'				=> true,
			'checkAllLabel'			=> __( 'all', 'wp24-domaincheck' ),
			'checkAllDefault'		=> false,
			'multicheck'			=> false,
			'textButton'			=> __( 'check', 'wp24-domaincheck' ),
			'showWhois'				=> false,
			'textWhois'				=> __( 'whois', 'wp24-domaincheck' ),
			'textAvailable'			=> __( 'is available', 'wp24-domaincheck' ),
			'colorAvailable'		=> '#008b00',
			'textRegistered'		=> __( 'is registered', 'wp24-domaincheck' ),
			'colorRegistered'		=> '',
			'textError'				=> __( 'error', 'wp24-domaincheck' ),
			'colorError'			=> '#8c0000',
			'textInvalid'			=> __( 'is invalid', 'wp24-domaincheck' ),
			'colorInvalid'			=> '#8c0000',
			'textLimit'				=> __( 'query limit reached', 'wp24-domaincheck' ),
			'colorLimit'			=> '#ff8c00',
			'textWhoisserver'		=> __( 'whois server unknown', 'wp24-domaincheck' ),
			'colorWhoisserver'		=> '#8c0000',
			'textUnsupported'		=> __( '.[tld] is not supported', 'wp24-domaincheck' ),
			'colorUnsupported'		=> '#ff8c00',
			'textTldMissing'		=> __( 'Please enter a domain extension', 'wp24-domaincheck' ),
			'colorTldMissing'		=> '',
			'textEmptyField'		=> '',
			'colorEmptyField'		=> '',
			'textInvalidField'		=> '',
			'colorInvalidField'		=> '',
			'priceEnabled'			=> false,
			'priceDefault'			=> '',
			'linkEnabled'			=> false,
			'linkDefault'			=> '',
			'textPurchase'			=> __( '[link]buy now[/link] for [price]', 'wp24-domaincheck' ),
			'priceTransferEnabled'	=> false,
			'priceTransferDefault'	=> '',
			'linkTransferEnabled'	=> false,
			'linkTransferDefault'	=> '',
			'textTransfer'			=> __( '[link]transfer now[/link] for [price]', 'wp24-domaincheck' ),
			'prefixes'				=> '',
			'suffixes'				=> '',
			'dotInSelect'			=> false,
			'useNonces'				=> false,
			'multipleUse'			=> false,
			'htmlForm'				=> true,
			'removeWhoisComments'	=> false,
			'hooksEnabled'			=> false,
			'reviewMessage'			=> true,
		);

		// unsupported tlds
		$this->options_default['unsupported'] = array(
			'enabled'		=> false,
			'text'			=> __( 'is probably available', 'wp24-domaincheck' ),
			'color'			=> '#008b00',
			'verify'		=> false,
			'verifyText'	=> __( 'verify', 'wp24-domaincheck' ),
		);

		// woocommerce options
		$this->options_default['woocommerce'] = array(
			'enabled'				=> false,
			'addToCartBehaviour'	=> 0,
			'customPageLink'		=> '',
			'addToCartText'			=> __( 'add to cart', 'wp24-domaincheck' ),
			'addedToCartText'		=> __( 'added to cart', 'wp24-domaincheck' ),
			'domainLabel'			=> __( 'Domain', 'wp24-domaincheck' ),
			'productidPurchase'		=> 0,
			'textPurchase'			=> __( '[link]buy now[/link] for [price]', 'wp24-domaincheck' ),
			'transferEnabled'		=> false,
			'productidTransfer'		=> 0,
			'textTransfer'			=> __( '[link]transfer now[/link] for [price]', 'wp24-domaincheck' ),
			'suffixTransfer'		=> __( '(Transfer)', 'wp24-domaincheck' ),
		);

		// recaptcha options
		$this->options_default['recaptcha'] = array(
			'type'		=> 'none',
			'siteKey'	=> '',
			'secretKey'	=> '',
			'theme'		=> 'light',
			'size'		=> 'normal',
			'position'	=> 'bottomright',
			'score'		=> 0.5,
			'text'		=> __( 'reCAPTCHA check failed', 'wp24-domaincheck' ),
			'color'		=> '#8c0000',
		);

		// query limit options
		$this->options_default['query_limits'] = array(
			'centralnic'	=> 60,
		);
	}

	/**
	 * Get options instance.
	 * 
	 * @return object Options instance.
	 */
	public static function get_instance() {
		if ( null == self::$instance ) {
			self::$instance = new WP24_Domain_Check_Options();
		}
		return self::$instance;
	}

	/**
	 * Get Options.
	 * 
	 * @return array Options.
	 */
	public function get_options() {
		$options = get_option( 'wp24_domaincheck' );
		if ( '' === $options || ! is_array( $options ) )
			return $this->options_default;

		// backward compatibility with v1.8.1
		if ( ! isset( $options['woocommerce']['addToCartBehaviour'] ) && $options['woocommerce']['redirectToCart'] )
			$options['woocommerce']['addToCartBehaviour'] = 0;

		// merge options with defaults if single options missing
		return array_merge( $this->options_default, $options );
	}

}

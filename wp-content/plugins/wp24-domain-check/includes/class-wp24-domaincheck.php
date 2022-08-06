<?php

/**
 * Class to output js, css and html.
 */
class WP24_Domain_Check {

	/**
	 * @var array Domain Check Settings.
	 */
	private $options;

	/**
	 * Constructor.
	 * 
	 * @return void
	 */
	public function __construct() {
		$instance = WP24_Domain_Check_Options::get_instance();
		$this->options = $instance->get_options();
	}

	/**
	 * Init shortcode and js script
	 * @return void
	 */
	public function init() {
		add_shortcode( 'wp24_domaincheck', array( $this, 'shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		require_once( dirname( __DIR__ ) . '/assets/inc/class-domaincheck.php' );
		$domaincheck = new WP24_Domain_Check_Domaincheck( $this->options );
		add_action( 'wp_ajax_whois_query', array( $domaincheck, 'whois_query' ) );
		add_action( 'wp_ajax_nopriv_whois_query', array( $domaincheck, 'whois_query' ) );

		// WooCommerce
		if ( $this->options['woocommerce']['enabled'] ) {
			add_action( 'wp_ajax_add_domain_to_cart', array( $this, 'woocommerce_add_domain_to_cart' ) );
			add_action( 'wp_ajax_nopriv_add_domain_to_cart', array( $this, 'woocommerce_add_domain_to_cart' ) );
			// add domain name to cart / order item
			add_filter( 'woocommerce_add_cart_item_data', array( $this, 'woocommerce_add_cart_item_data' ), 10, 4 );
			add_filter( 'woocommerce_get_item_data', array( $this, 'woocommerce_get_item_data' ), 10, 2 );
			add_action( 'woocommerce_checkout_create_order_line_item', array( $this, 'woocommerce_checkout_create_order_line_item' ), 10, 4 );
		}
	}

	/**
	 * Add domain to cart ajax handler.
	 */
	public function woocommerce_add_domain_to_cart() {
		$json_data = array(
			'success' => false,
		);

		if ( isset( $_POST['type'] ) && 'multi' == $_POST['type'] ) {
			if ( ! isset( $_POST['data'] ) ) {
				wp_send_json( $json_data );
				wp_die();
			}

			$json_data['success'] = true;
			$data = $_POST['data'];
			for ( $i = 0; $i < count( $data ); $i++ ) {
				$product_id = sanitize_key( $data[ $i ]['product_id'] );
				$cart_item_data = array(
					'wp24_domain' => sanitize_text_field( $data[ $i ]['domain'] ) . 
						( isset( $data[ $i ]['transfer'] ) && '' != $this->options['woocommerce']['suffixTransfer'] ? ' ' . $this->options['woocommerce']['suffixTransfer'] : '' ),
				);

				if ( ! WC()->cart->add_to_cart( $product_id, 1, 0, array(), $cart_item_data ) )
					$json_data['success'] = false;
			}
		}
		else {
			$product_id = sanitize_key( $_POST['product_id'] );
			$cart_item_data = array(
				'wp24_domain' => sanitize_text_field( $_POST['domain'] ) . 
					( isset( $_POST['transfer'] ) && '' != $this->options['woocommerce']['suffixTransfer'] ? ' ' . $this->options['woocommerce']['suffixTransfer'] : '' ),
			);

			if ( WC()->cart->add_to_cart( $product_id, 1, 0, array(), $cart_item_data ) )
				$json_data['success'] = true;
		}

		// refresh fragments when using ajax
		if ( $json_data['success'] && in_array( $this->options['woocommerce']['addToCartBehaviour'], array( 1, 3 ) ) )
			WC_AJAX::get_refreshed_fragments();
		else
			wp_send_json( $json_data );
		wp_die();
	}

	/**
	 * Add domain name as custom cart item data.
	 */
	public function woocommerce_add_cart_item_data( $cart_item_data, $product_id, $variation_id, $quantity ) {
		if ( isset( $_GET['domain'] ) && ! empty( $_GET['domain'] ) ) {
			$cart_item_data['wp24_domain'] = sanitize_text_field( $_GET['domain'] ) . 
				( isset( $_GET['transfer'] ) && '' != $this->options['woocommerce']['suffixTransfer'] ? ' ' . $this->options['woocommerce']['suffixTransfer'] : '' );
		}
		return $cart_item_data;
	}

	/**
	 * Display domain name in cart and checkout pages as cart item data.
	 */
	public function woocommerce_get_item_data( $item_data, $cart_item ) {
		if ( isset( $cart_item['wp24_domain'] ) ) {
			$item_data[] = array(
				'name'	=> $this->options['woocommerce']['domainLabel'],
				'value'	=> $cart_item['wp24_domain'],
			);
		}
		return $item_data;
	}

	/**
	 * Save and display domain name in orders.
	 */
	public function woocommerce_checkout_create_order_line_item( $item, $cart_item_key, $values, $order ) {
		if ( isset( $values['wp24_domain'] ) )
			$item->update_meta_data( $this->options['woocommerce']['domainLabel'], $values['wp24_domain'] );
	}

	/**
	 * Register js script.
	 * 
	 * @return void
	 */
	public function enqueue_scripts() {
		// default js file path
		$js_file_path = plugins_url( 'assets/js/domaincheck.js', dirname( __FILE__ ) );

		// check for js file override in theme
		if ( file_exists( get_stylesheet_directory() . '/wp24-domain-check/assets/js/domaincheck.js' ) )
			$js_file_path = get_stylesheet_directory_uri() . '/wp24-domain-check/assets/js/domaincheck.js';

		// just register the scripts, enqueue in shortcode
		wp_register_script(
			'domaincheck',
			$js_file_path,
			array( 'jquery' ),
			WP24_DOMAIN_CHECK_VERSION,
			true
		);
	}

	/**
	 * Shortcode execution.
	 * 
	 * @param array $atts 
	 * @param string $content 
	 * @param string $tag 
	 * @return string html code (div).
	 */
	public function shortcode( $atts = [], $content = NULL, $tag = '' ) {
		// normalize attribute keys, lowercase
		$atts = array_change_key_case( (array)$atts, CASE_LOWER );
		// override default attributes with user attributes
		$atts = shortcode_atts( [
			'id'		=> $this->options['multipleUse'] ? uniqid() : '1',
			'mode'		=> 'check',
			'html_form'	=> $this->options['htmlForm'],
			'addjs'		=> 1,
		], $atts, $tag );
		// id to use shortcode multiple times (accept only alphanumeric characters)
		$id = preg_replace( '/[^a-z0-9]/i', '', $atts['id'] );

		// recaptcha
		if ( in_array( $this->options['recaptcha']['type'], array( 'v2_check', 'v2_badge' ) ) ) {
			// add "async defer" to recaptcha script tag
			add_filter(
				'script_loader_tag',
				function( $tag, $handle ) {
					if ( 'recaptcha' !== $handle )
						return $tag;
					return str_replace( '></', ' async defer></', $tag );
				},
				10,
				2
			);
			wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js', '', NULL );
		}
		if ( 'v3' == $this->options['recaptcha']['type'] ) {
			wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js?render=explicit', '', NULL );
		}

		// enqueue scripts only when shortcode is used
		wp_enqueue_script( 'domaincheck' );
		$js = 
			"jQuery( function( $ ) {\n".
			"  $( '#wp24-dc-" . $id . "' ).wp24_domain_check( {\n";
		$js .=
			"    id: '" . $id . "',\n".
			"    mode: '" . $atts['mode'] . "',\n".
			"    path: '" . plugins_url( '/', dirname( __FILE__ ) ) . "',\n".
			"    ajaxurl: '" . ( $this->options['useNonces'] ? wp_nonce_url( admin_url( 'admin-ajax.php' ), 'domain_check', 'n' ) : admin_url( 'admin-ajax.php' ) ) . "',\n".
			"    fieldLabel: '" . __( $this->options['fieldLabel'] ) . "',\n".
			"    fieldPlaceholder: '" . __( $this->options['fieldPlaceholder'] ) . "',\n".
			"    fieldWidth: '" . intval( $this->options['fieldWidth'] ) . $this->options['fieldUnit'] . "',\n".
			"    fieldnameDomain: '" . $this->options['fieldnameDomain'] . "',\n".
			"    fieldnameTld: '" . $this->options['fieldnameTld'] . "',\n".
			"    selectionType: '" . $this->options['selectionType'] . "',\n".
			"    tlds: '" . $this->options['tlds'] . "',\n".
			"    checkAll: " . ( $this->options['checkAll'] ? "true" : "false" ) . ",\n".
			"    checkAllLabel: '" . __( $this->options['checkAllLabel'] ) . "',\n".
			"    checkAllDefault: " . ( $this->options['checkAllDefault'] ? "true" : "false" ) . ",\n".
			"    multicheck: " . ( $this->options['multicheck'] ? "true" : "false" ) . ",\n".
			"    textButton: '" . __( $this->options['textButton'] ) . "',\n".
			"    showWhois: " . ( $this->options['showWhois'] ? "true" : "false" ) . ",\n".
			"    textWhois: '" . __( $this->options['textWhois'] ) . "',\n".
			"    textAvailable: '" . __( $this->options['textAvailable'] ) . "',\n".
			"    colorAvailable: '" . $this->options['colorAvailable'] . "',\n".
			"    textRegistered: '" . __( $this->options['textRegistered'] ) . "',\n".
			"    colorRegistered: '" . $this->options['colorRegistered'] . "',\n".
			"    textError: '" . __( $this->options['textError'] ) . "',\n".
			"    colorError: '" . $this->options['colorError'] . "',\n".
			"    textInvalid: '" . __( $this->options['textInvalid'] ) . "',\n".
			"    colorInvalid: '" . $this->options['colorInvalid'] . "',\n".
			"    textLimit: '" . __( $this->options['textLimit'] ) . "',\n".
			"    colorLimit: '" . $this->options['colorLimit'] . "',\n".
			"    textWhoisserver: '" . __( $this->options['textWhoisserver'] ) . "',\n".
			"    colorWhoisserver: '" . $this->options['colorWhoisserver'] . "',\n".
			"    textUnsupported: '" . __( $this->options['textUnsupported'] ) . "',\n".
			"    colorUnsupported: '" . $this->options['colorUnsupported'] . "',\n".
			"    textTldMissing: '" . __( $this->options['textTldMissing'] ) . "',\n".
			"    colorTldMissing: '" . $this->options['colorTldMissing'] . "',\n".
			"    textEmptyField: '" . __( $this->options['textEmptyField'] ) . "',\n".
			"    colorEmptyField: '" . $this->options['colorEmptyField'] . "',\n".
			"    textInvalidField: '" . __( $this->options['textInvalidField'] ) . "',\n".
			"    colorInvalidField: '" . $this->options['colorInvalidField'] . "',\n".
			"    prefixes: '" . $this->options['prefixes'] . "',\n".
			"    suffixes: '" . $this->options['suffixes'] . "',\n".
			"    dotInSelect: " . ( $this->options['dotInSelect'] ? "true" : "false" ) . ",\n".
			"    htmlForm: " . ( boolval( $atts['html_form'] ) ? "true" : "false" ) . ",\n";
		if ( $this->options['woocommerce']['enabled'] ) {
			$js .=
				"    textPurchase: '" . __( $this->options['woocommerce']['textPurchase'] ) . "',\n".
				"    textTransfer: '" . __( $this->options['woocommerce']['textTransfer'] ) . "',\n".
				"    addToCartBehaviour: " . intval( $this->options['woocommerce']['addToCartBehaviour'] ) . ",\n";
			if ( intval( $this->options['woocommerce']['addToCartBehaviour'] ) == 2 && '' != $this->options['woocommerce']['customPageLink'] )
				$js .= "    customPageLink: '" . $this->options['woocommerce']['customPageLink'] . "',\n";
			if ( intval( $this->options['woocommerce']['addToCartBehaviour'] ) == 3 )
				$js .= "    addToCartText: '" . $this->options['woocommerce']['addToCartText'] . "',\n";
			$js .=
				"    addedToCartText: '" . __( $this->options['woocommerce']['addedToCartText'] ) . "',\n";
		}
		else {
			$js .=
				"    textPurchase: '" . __( $this->options['textPurchase'] ) . "',\n".
				"    textTransfer: '" . __( $this->options['textTransfer'] ) . "',\n".
				"    addToCartBehaviour: 0,\n";
		}
		if ( $this->options['unsupported']['enabled'] ) {
			$js .=
				"    unsupported: {\n".
				"      enabled: true,\n".
				"      text: '" . __( $this->options['unsupported']['text'] ) . "',\n".
				"      color: '" . $this->options['unsupported']['color'] . "',\n".
				"      verify: " . ( $this->options['unsupported']['verify'] ? "true" : "false" ) . ",\n".
				"      verifyText: '" . __( $this->options['unsupported']['verifyText'] ) . "',\n".
				"    },\n";
		}
		else {
			$js .=
				"    unsupported: {\n".
				"      enabled: false,\n".
				"    },\n";
		}
		if ( 'none' != $this->options['recaptcha']['type'] ) {
			$js .=
				"    recaptcha: {\n".
				"      type: '" . $this->options['recaptcha']['type'] . "',\n".
				"      siteKey: '" . $this->options['recaptcha']['siteKey'] . "',\n".
				"      theme: '" . $this->options['recaptcha']['theme'] . "',\n".
				"      size: '" . $this->options['recaptcha']['size'] . "',\n".
				"      position: '" . $this->options['recaptcha']['position'] . "',\n".
				"      text: '" . __( $this->options['recaptcha']['text'] ) . "',\n".
				"      color: '" . $this->options['recaptcha']['color'] . "',\n".
				"    },\n";
		}
		else {
			$js .=
				"    recaptcha: {\n".
				"      type: '" . $this->options['recaptcha']['type'] . "',\n".
				"    },\n";
		}

		$js .=
			"  } );\n".
			"} );";
		// compress js code a little bit
		$js = preg_replace( '/\s\s+|\n|\t/', '', $js );
		if ( boolval( $atts['addjs'] ) )
			wp_add_inline_script( 'domaincheck', $js );

		// add style
		wp_enqueue_style(
			'domaincheck',
			plugins_url( 'assets/css/domaincheck.css', dirname( __FILE__ ) ),
			'',
			WP24_DOMAIN_CHECK_VERSION
		);

		// enqueue script and style for modal window
		if ( $this->options['showWhois'] ) {
			wp_enqueue_script(
				'jquery-modal',
				plugins_url( 'assets/js/jquery-modal.min.js', dirname( __FILE__ ) ),
				'',
				'0.9.2'
			);
			wp_enqueue_style(
				'jquery-modal',
				plugins_url( 'assets/css/jquery-modal.min.css', dirname( __FILE__ ) ),
				'',
				'0.9.2'
			);
		}

		return '<div id="wp24-dc-' . $id . '" class="wp24-dc"></div>';
	}

}

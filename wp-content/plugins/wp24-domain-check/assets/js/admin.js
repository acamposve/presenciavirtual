jQuery( function( $ ) {

	// initialize color pickers
	$( 'input.colorPicker' ).wpColorPicker();

	// selectionType: enable/disable tlds, checkAll, checkAllLabel, checkAllDefault
	if ( 'unlimited' == $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val() ) {
		$( 'textarea[name="wp24_domaincheck[tlds]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[checkAll]"]' ).prop( 'disabled', true );
	}
	$( '#grouped-example' ).prop( 'hidden', 'grouped' !== $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val() );
	$( 'input[name="wp24_domaincheck[selectionType]"]' ).change( function() {
		var flag;
		flag = 'unlimited' == $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val();
		$( 'textarea[name="wp24_domaincheck[tlds]"]' ).prop( 'disabled', flag );
		$( 'input[name="wp24_domaincheck[checkAll]"]' ).prop( 'disabled', flag );
		flag = 'freetext' == $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val() ||
			'unlimited' == $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val();
		$( 'input[name="wp24_domaincheck[checkAllLabel]"]' ).prop( 'disabled', flag );
		$( 'input[name="wp24_domaincheck[checkAllDefault]"]' ).prop( 'disabled', flag );
		flag = 'grouped' == $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val();
		$( '#grouped-example' ).prop( 'hidden', ! flag );
	} );
	// checkAll: enable/disable checkAllLabel
	$( 'input[name="wp24_domaincheck[checkAll]"]' ).change( function() {
		if ( 'freetext' != $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val() ) {
			$( 'input[name="wp24_domaincheck[checkAllLabel]"]' ).prop( 'disabled', ! this.checked );
			$( 'input[name="wp24_domaincheck[checkAllDefault]"]' ).prop( 'disabled', ! this.checked );
		}
	} );
	if ( ! $( 'input[name="wp24_domaincheck[checkAll]"]' ).prop( 'checked' ) ||
		'freetext' == $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val() ||
		'unlimited' == $( 'input[name="wp24_domaincheck[selectionType]"]:checked' ).val() ) {
		$( 'input[name="wp24_domaincheck[checkAllLabel]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[checkAllDefault]"]' ).prop( 'disabled', true );
	}
	// showWhois: enable/disable textWhois
	if ( ! $( 'input[name="wp24_domaincheck[showWhois]"]' ).prop( 'checked' ) )
		$( 'input[name="wp24_domaincheck[textWhois]"]' ).prop( 'disabled', true );
	$( 'input[name="wp24_domaincheck[showWhois]"]' ).change( function() {
		$( 'input[name="wp24_domaincheck[textWhois]"]' ).prop( 'disabled', ! this.checked );
	} );

	// unsupported: enable/disable dependent options
	if ( ! $( 'input[name="wp24_domaincheck[unsupported][enabled]"]' ).prop( 'checked' ) ) {
		$( 'input[name="wp24_domaincheck[unsupported][text]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[unsupported][color]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[unsupported][verify]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[unsupported][verifyText]"]' ).prop( 'disabled', true );
	}
	$( 'input[name="wp24_domaincheck[unsupported][enabled]"]' ).change( function() {
		$( 'input[name="wp24_domaincheck[unsupported][text]"]' ).prop( 'disabled', ! this.checked );
		$( 'input[name="wp24_domaincheck[unsupported][color]"]' ).prop( 'disabled', ! this.checked );
		$( 'input[name="wp24_domaincheck[unsupported][verify]"]' ).prop( 'disabled', ! this.checked );
		if ( ! this.checked )
			$( 'input[name="wp24_domaincheck[unsupported][verifyText]"]' ).prop( 'disabled', true );
		else {
			$( 'input[name="wp24_domaincheck[unsupported][verifyText]"]' ).prop( 'disabled', 
				! $( 'input[name="wp24_domaincheck[unsupported][verify]"]' ).prop( 'checked' ) );
		}
	} );
	// unsupported verify: enable/disable verifyText
	if ( ! $( 'input[name="wp24_domaincheck[unsupported][verify]"]' ).prop( 'checked' ) )
		$( 'input[name="wp24_domaincheck[unsupported][verifyText]"]' ).prop( 'disabled', true );
	$( 'input[name="wp24_domaincheck[unsupported][verify]"]' ).change( function() {
		$( 'input[name="wp24_domaincheck[unsupported][verifyText]"]' ).prop( 'disabled', ! this.checked );
	} );

	// priceEnabled: enable/disable priceDefault
	if ( ! $( 'input[name="wp24_domaincheck[priceEnabled]"]' ).prop( 'checked' ) )
		$( 'input[name="wp24_domaincheck[priceDefault]"]' ).prop( 'disabled', true );
	$( 'input[name="wp24_domaincheck[priceEnabled]"]' ).change( function() {
		$( 'input[name="wp24_domaincheck[priceDefault]"]' ).prop( 'disabled', ! this.checked );
	} );
	// linkEnabled: enable/disable linkDefault
	if ( ! $( 'input[name="wp24_domaincheck[linkEnabled]"]' ).prop( 'checked' ) )
		$( 'input[name="wp24_domaincheck[linkDefault]"]' ).prop( 'disabled', true );
	$( 'input[name="wp24_domaincheck[linkEnabled]"]' ).change( function() {
		$( 'input[name="wp24_domaincheck[linkDefault]"]' ).prop( 'disabled', ! this.checked );
	} );
	// priceTransferEnabled: enable/disable priceTransferDefault
	if ( ! $( 'input[name="wp24_domaincheck[priceTransferEnabled]"]' ).prop( 'checked' ) )
		$( 'input[name="wp24_domaincheck[priceTransferDefault]"]' ).prop( 'disabled', true );
	$( 'input[name="wp24_domaincheck[priceTransferEnabled]"]' ).change( function() {
		$( 'input[name="wp24_domaincheck[priceTransferDefault]"]' ).prop( 'disabled', ! this.checked );
	} );
	// linkTransferEnabled: enable/disable linkTransferDefault
	if ( ! $( 'input[name="wp24_domaincheck[linkTransferEnabled]"]' ).prop( 'checked' ) )
		$( 'input[name="wp24_domaincheck[linkTransferDefault]"]' ).prop( 'disabled', true );
	$( 'input[name="wp24_domaincheck[linkTransferEnabled]"]' ).change( function() {
		$( 'input[name="wp24_domaincheck[linkTransferDefault]"]' ).prop( 'disabled', ! this.checked );
	} );

	window.editTldPriceLink = function( tld, price, link, price_transfer, link_transfer ) {
		$( 'input[name="tld"]' ).val( tld );
		$( 'input[name="price"]' ).val( price );
		$( 'input[name="link"]' ).val( link );
		$( 'input[name="price_transfer"]' ).val( price_transfer );
		$( 'input[name="link_transfer"]' ).val( link_transfer );
	}

	// woocommerce: disable/enable options depending on integration
	if ( ! $( 'input[name="wp24_domaincheck[woocommerce][enabled]"]' ).prop( 'checked' ) ) {
		$( 'select[name^="wp24_domaincheck[woocommerce]"]' ).prop( 'disabled', true );
		$( 'input[name^="wp24_domaincheck[woocommerce]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[woocommerce][enabled]"]' ).prop( 'disabled', false );
	}
	$( 'input[name="wp24_domaincheck[woocommerce][enabled]"]' ).change( function() {
		var flag;
		$( 'select[name^="wp24_domaincheck[woocommerce]"]' ).prop( 'disabled', ! this.checked );
		$( 'input[name^="wp24_domaincheck[woocommerce]"]' ).prop( 'disabled', ! this.checked );
		$( 'input[name="wp24_domaincheck[woocommerce][enabled]"]' ).prop( 'disabled', false );
		flag = ! this.checked || ! $( 'input[name="wp24_domaincheck[woocommerce][transferEnabled]"]' ).prop( 'checked' );
		$( 'select[name="wp24_domaincheck[woocommerce][productidTransfer]"]' ).prop( 'disabled', flag );
		$( 'input[name="wp24_domaincheck[woocommerce][textTransfer]"]' ).prop( 'disabled', flag );
		$( 'input[name="wp24_domaincheck[woocommerce][suffixTransfer]"]' ).prop( 'disabled', flag );
		flag = ! this.checked || $( 'select[name="wp24_domaincheck[woocommerce][addToCartBehaviour]"]' ).val() != 3;
		$( 'input[name="wp24_domaincheck[woocommerce][addToCartText]"]' ).prop( 'disabled', flag );
		flag = ! this.checked || -1 !== [1, 3].indexOf( $( 'select[name="wp24_domaincheck[woocommerce][addToCartBehaviour]"]' ).val() );
		$( 'input[name="wp24_domaincheck[woocommerce][addedToCartText]"]' ).prop( 'disabled', flag );
		flag = ! this.checked || $( 'select[name="wp24_domaincheck[woocommerce][addToCartBehaviour]"]' ).val() != 2;
		$( 'input[name="wp24_domaincheck[woocommerce][customPageLink]"]' ).prop( 'disabled', flag );
	} );
	if ( ! $( 'input[name="wp24_domaincheck[woocommerce][transferEnabled]"]' ).prop( 'checked' ) ) {
		$( 'select[name="wp24_domaincheck[woocommerce][productidTransfer]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[woocommerce][textTransfer]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[woocommerce][suffixTransfer]"]' ).prop( 'disabled', true );
	}
	$( 'select[name="wp24_domaincheck[woocommerce][addToCartBehaviour]"]' ).change( function() {
		$( 'input[name="wp24_domaincheck[woocommerce][addToCartText]"]' ).prop( 'disabled', this.value != 3 );
		$( 'input[name="wp24_domaincheck[woocommerce][addedToCartText]"]' ).prop( 'disabled', -1 !== [1, 3].indexOf( this.value ) );
		$( 'input[name="wp24_domaincheck[woocommerce][customPageLink]"]' ).prop( 'disabled', this.value != 2 );
	} );
	if ( $( 'select[name="wp24_domaincheck[woocommerce][addToCartBehaviour]"]' ).val() != 3 )
		$( 'input[name="wp24_domaincheck[woocommerce][addToCartText]"]' ).prop( 'disabled', true );
	if ( -1 !== [1, 3].indexOf( $( 'select[name="wp24_domaincheck[woocommerce][addToCartBehaviour]"]' ).val() ) )
		$( 'input[name="wp24_domaincheck[woocommerce][addedToCartText]"]' ).prop( 'disabled', true );
	if ( $( 'select[name="wp24_domaincheck[woocommerce][addToCartBehaviour]"]' ).val() != 2 )
		$( 'input[name="wp24_domaincheck[woocommerce][customPageLink]"]' ).prop( 'disabled', true );
	$( 'input[name="wp24_domaincheck[woocommerce][transferEnabled]"]' ).change( function() {
		$( 'select[name="wp24_domaincheck[woocommerce][productidTransfer]"]' ).prop( 'disabled', ! this.checked );
		$( 'input[name="wp24_domaincheck[woocommerce][textTransfer]"]' ).prop( 'disabled', ! this.checked );
		$( 'input[name="wp24_domaincheck[woocommerce][suffixTransfer]"]' ).prop( 'disabled', ! this.checked );
	} );

	window.editTldWooCommerce = function( tld, product_id_purchase, product_id_transfer ) {
		$( 'input[name="tld"]' ).val( tld );
		$( 'select[name="product_id_purchase"]' ).val( product_id_purchase );
		$( 'select[name="product_id_transfer"]' ).val( product_id_transfer );
	}

	window.editTldWhoisServers = function( tld, host, status_free ) {
		$( 'input[name="tld"]' ).val( tld );
		$( 'input[name="host"]' ).val( host );
		$( 'input[name="status_free"]' ).val( status_free );
	}

	// recaptcha: disable/enable options depending on type
	if ( 'none' == $( 'input[name="wp24_domaincheck[recaptcha][type]"]:checked' ).val() ) {
		$( 'input[name^="wp24_domaincheck[recaptcha]"]' ).prop( 'disabled', true );
		$( 'input[name="wp24_domaincheck[recaptcha][type]"]' ).prop( 'disabled', false );
	}
	if ( -1 !== ['v2_badge', 'v3'].indexOf( $( 'input[name="wp24_domaincheck[recaptcha][type]"]:checked' ).val() ) ) {
		// no size with recaptcha v2_badge/v3
		$( 'input[name="wp24_domaincheck[recaptcha][size]"]' ).prop( 'disabled', true );
	}
	if ( 'v2_check' == $( 'input[name="wp24_domaincheck[recaptcha][type]"]:checked' ).val() ) {
		// no position with recaptcha v2_check
		$( 'input[name="wp24_domaincheck[recaptcha][position]"]' ).prop( 'disabled', true );
	}
	if ( -1 !== ['v2_check', 'v2_badge'].indexOf( $( 'input[name="wp24_domaincheck[recaptcha][type]"]:checked' ).val() ) ) {
		// no score with recaptcha v2
		$( 'input[name="wp24_domaincheck[recaptcha][score]"]' ).prop( 'disabled', true );
	}
	$( 'input[name="wp24_domaincheck[recaptcha][type]"]' ).change( function() {
		var val = $( 'input[name="wp24_domaincheck[recaptcha][type]"]:checked' ).val();
		var flag = 'none' == val;
		
		$( 'input[name^="wp24_domaincheck[recaptcha]"]' ).prop( 'disabled', flag );
		$( 'input[name="wp24_domaincheck[recaptcha][type]"]' ).prop( 'disabled', false );

		if ( -1 !== ['v2_badge', 'v3'].indexOf( val ) ) {
			// no size with recaptcha v2_badge/v3
			$( 'input[name="wp24_domaincheck[recaptcha][size]"]' ).prop( 'disabled', true );
		}
		if ( 'v2_check' == val ) {
			// no position with recaptcha v2_check
			$( 'input[name="wp24_domaincheck[recaptcha][position]"]' ).prop( 'disabled', true );
		}
		if ( -1 !== ['v2_check', 'v2_badge'].indexOf( val ) ) {
			// no score with recaptcha v2
			$( 'input[name="wp24_domaincheck[recaptcha][score]"]' ).prop( 'disabled', true );
		}
	} );

} );
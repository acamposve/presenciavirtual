<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/ads/googleads/v8/errors/feed_attribute_reference_error.proto

namespace GPBMetadata\Google\Ads\GoogleAds\V8\Errors;

class FeedAttributeReferenceError
{
    public static $is_initialized = false;

    public static function initOnce() {
        $pool = \Google\Protobuf\Internal\DescriptorPool::getGeneratedPool();
        if (static::$is_initialized == true) {
          return;
        }
        \GPBMetadata\Google\Api\Http::initOnce();
        \GPBMetadata\Google\Api\Annotations::initOnce();
        $pool->internalAddGeneratedFile(
            '
�
Cgoogle/ads/googleads/v8/errors/feed_attribute_reference_error.protogoogle.ads.googleads.v8.errors"�
FeedAttributeReferenceErrorEnum"�
FeedAttributeReferenceError
UNSPECIFIED 
UNKNOWN!
CANNOT_REFERENCE_REMOVED_FEED
INVALID_FEED_NAME
INVALID_FEED_ATTRIBUTE_NAMEB�
"com.google.ads.googleads.v8.errorsB FeedAttributeReferenceErrorProtoPZDgoogle.golang.org/genproto/googleapis/ads/googleads/v8/errors;errors�GAA�Google.Ads.GoogleAds.V8.Errors�Google\\Ads\\GoogleAds\\V8\\Errors�"Google::Ads::GoogleAds::V8::Errorsbproto3'
        , true);
        static::$is_initialized = true;
    }
}


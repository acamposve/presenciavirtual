<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/ads/googleads/v8/resources/display_keyword_view.proto

namespace GPBMetadata\Google\Ads\GoogleAds\V8\Resources;

class DisplayKeywordView
{
    public static $is_initialized = false;

    public static function initOnce() {
        $pool = \Google\Protobuf\Internal\DescriptorPool::getGeneratedPool();
        if (static::$is_initialized == true) {
          return;
        }
        \GPBMetadata\Google\Api\Http::initOnce();
        \GPBMetadata\Google\Api\Annotations::initOnce();
        \GPBMetadata\Google\Api\FieldBehavior::initOnce();
        \GPBMetadata\Google\Api\Resource::initOnce();
        $pool->internalAddGeneratedFile(
            '
�
<google/ads/googleads/v8/resources/display_keyword_view.proto!google.ads.googleads.v8.resourcesgoogle/api/resource.protogoogle/api/annotations.proto"�
DisplayKeywordViewJ
resource_name (	B3�A�A-
+googleads.googleapis.com/DisplayKeywordView:z�Aw
+googleads.googleapis.com/DisplayKeywordViewHcustomers/{customer_id}/displayKeywordViews/{ad_group_id}~{criterion_id}B�
%com.google.ads.googleads.v8.resourcesBDisplayKeywordViewProtoPZJgoogle.golang.org/genproto/googleapis/ads/googleads/v8/resources;resources�GAA�!Google.Ads.GoogleAds.V8.Resources�!Google\\Ads\\GoogleAds\\V8\\Resources�%Google::Ads::GoogleAds::V8::Resourcesbproto3'
        , true);
        static::$is_initialized = true;
    }
}


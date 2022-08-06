<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/ads/googleads/v8/services/expanded_landing_page_view_service.proto

namespace GPBMetadata\Google\Ads\GoogleAds\V8\Services;

class ExpandedLandingPageViewService
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
        \GPBMetadata\Google\Api\Client::initOnce();
        $pool->internalAddGeneratedFile(
            '
�
Bgoogle/ads/googleads/v8/resources/expanded_landing_page_view.proto!google.ads.googleads.v8.resourcesgoogle/api/resource.protogoogle/api/annotations.proto"�
ExpandedLandingPageViewO
resource_name (	B8�A�A2
0googleads.googleapis.com/ExpandedLandingPageView$
expanded_final_url (	B�AH �:��A�
0googleads.googleapis.com/ExpandedLandingPageViewQcustomers/{customer_id}/expandedLandingPageViews/{expanded_final_url_fingerprint}B
_expanded_final_urlB�
%com.google.ads.googleads.v8.resourcesBExpandedLandingPageViewProtoPZJgoogle.golang.org/genproto/googleapis/ads/googleads/v8/resources;resources�GAA�!Google.Ads.GoogleAds.V8.Resources�!Google\\Ads\\GoogleAds\\V8\\Resources�%Google::Ads::GoogleAds::V8::Resourcesbproto3
�
Igoogle/ads/googleads/v8/services/expanded_landing_page_view_service.proto google.ads.googleads.v8.servicesgoogle/api/annotations.protogoogle/api/client.protogoogle/api/field_behavior.protogoogle/api/resource.proto"t
!GetExpandedLandingPageViewRequestO
resource_name (	B8�A�A2
0googleads.googleapis.com/ExpandedLandingPageView2�
ExpandedLandingPageViewService�
GetExpandedLandingPageViewC.google.ads.googleads.v8.services.GetExpandedLandingPageViewRequest:.google.ads.googleads.v8.resources.ExpandedLandingPageView"R���<:/v8/{resource_name=customers/*/expandedLandingPageViews/*}�Aresource_nameE�Agoogleads.googleapis.com�A\'https://www.googleapis.com/auth/adwordsB�
$com.google.ads.googleads.v8.servicesB#ExpandedLandingPageViewServiceProtoPZHgoogle.golang.org/genproto/googleapis/ads/googleads/v8/services;services�GAA� Google.Ads.GoogleAds.V8.Services� Google\\Ads\\GoogleAds\\V8\\Services�$Google::Ads::GoogleAds::V8::Servicesbproto3'
        , true);
        static::$is_initialized = true;
    }
}


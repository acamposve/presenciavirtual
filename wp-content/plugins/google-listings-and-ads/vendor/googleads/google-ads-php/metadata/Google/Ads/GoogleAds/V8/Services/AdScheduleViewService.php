<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/ads/googleads/v8/services/ad_schedule_view_service.proto

namespace GPBMetadata\Google\Ads\GoogleAds\V8\Services;

class AdScheduleViewService
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
�
8google/ads/googleads/v8/resources/ad_schedule_view.proto!google.ads.googleads.v8.resourcesgoogle/api/resource.protogoogle/api/annotations.proto"�
AdScheduleViewF
resource_name (	B/�A�A)
\'googleads.googleapis.com/AdScheduleView:r�Ao
\'googleads.googleapis.com/AdScheduleViewDcustomers/{customer_id}/adScheduleViews/{campaign_id}~{criterion_id}B�
%com.google.ads.googleads.v8.resourcesBAdScheduleViewProtoPZJgoogle.golang.org/genproto/googleapis/ads/googleads/v8/resources;resources�GAA�!Google.Ads.GoogleAds.V8.Resources�!Google\\Ads\\GoogleAds\\V8\\Resources�%Google::Ads::GoogleAds::V8::Resourcesbproto3
�
?google/ads/googleads/v8/services/ad_schedule_view_service.proto google.ads.googleads.v8.servicesgoogle/api/annotations.protogoogle/api/client.protogoogle/api/field_behavior.protogoogle/api/resource.proto"b
GetAdScheduleViewRequestF
resource_name (	B/�A�A)
\'googleads.googleapis.com/AdScheduleView2�
AdScheduleViewService�
GetAdScheduleView:.google.ads.googleads.v8.services.GetAdScheduleViewRequest1.google.ads.googleads.v8.resources.AdScheduleView"I���31/v8/{resource_name=customers/*/adScheduleViews/*}�Aresource_nameE�Agoogleads.googleapis.com�A\'https://www.googleapis.com/auth/adwordsB�
$com.google.ads.googleads.v8.servicesBAdScheduleViewServiceProtoPZHgoogle.golang.org/genproto/googleapis/ads/googleads/v8/services;services�GAA� Google.Ads.GoogleAds.V8.Services� Google\\Ads\\GoogleAds\\V8\\Services�$Google::Ads::GoogleAds::V8::Servicesbproto3'
        , true);
        static::$is_initialized = true;
    }
}


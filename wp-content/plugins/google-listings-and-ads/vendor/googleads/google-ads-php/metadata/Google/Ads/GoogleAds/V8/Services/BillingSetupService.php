<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/ads/googleads/v8/services/billing_setup_service.proto

namespace GPBMetadata\Google\Ads\GoogleAds\V8\Services;

class BillingSetupService
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
�
8google/ads/googleads/v8/enums/billing_setup_status.protogoogle.ads.googleads.v8.enums"�
BillingSetupStatusEnum"o
BillingSetupStatus
UNSPECIFIED 
UNKNOWN
PENDING
APPROVED_HELD
APPROVED
	CANCELLEDB�
!com.google.ads.googleads.v8.enumsBBillingSetupStatusProtoPZBgoogle.golang.org/genproto/googleapis/ads/googleads/v8/enums;enums�GAA�Google.Ads.GoogleAds.V8.Enums�Google\\Ads\\GoogleAds\\V8\\Enums�!Google::Ads::GoogleAds::V8::Enumsbproto3
�
-google/ads/googleads/v8/enums/time_type.protogoogle.ads.googleads.v8.enums"N
TimeTypeEnum">
TimeType
UNSPECIFIED 
UNKNOWN
NOW
FOREVERB�
!com.google.ads.googleads.v8.enumsBTimeTypeProtoPZBgoogle.golang.org/genproto/googleapis/ads/googleads/v8/enums;enums�GAA�Google.Ads.GoogleAds.V8.Enums�Google\\Ads\\GoogleAds\\V8\\Enums�!Google::Ads::GoogleAds::V8::Enumsbproto3
�
5google/ads/googleads/v8/resources/billing_setup.proto!google.ads.googleads.v8.resources-google/ads/googleads/v8/enums/time_type.protogoogle/api/field_behavior.protogoogle/api/resource.protogoogle/api/annotations.proto"�
BillingSetupD
resource_name (	B-�A�A\'
%googleads.googleapis.com/BillingSetup
id (B�AH�]
status (2H.google.ads.googleads.v8.enums.BillingSetupStatusEnum.BillingSetupStatusB�AO
payments_account (	B0�A�A*
(googleads.googleapis.com/PaymentsAccountH�g
payments_account_info (2C.google.ads.googleads.v8.resources.BillingSetup.PaymentsAccountInfoB�A
start_date_time (	B�AH T
start_time_type
 (24.google.ads.googleads.v8.enums.TimeTypeEnum.TimeTypeB�AH 
end_date_time (	B�AHR
end_time_type (24.google.ads.googleads.v8.enums.TimeTypeEnum.TimeTypeB�AH�
PaymentsAccountInfo%
payments_account_id (	B�AH �\'
payments_account_name (	B�AH�%
payments_profile_id (	B�AH�\'
payments_profile_name	 (	B�AH�/
secondary_payments_profile_id
 (	B�AH�B
_payments_account_idB
_payments_account_nameB
_payments_profile_idB
_payments_profile_nameB 
_secondary_payments_profile_id:d�Aa
%googleads.googleapis.com/BillingSetup8customers/{customer_id}/billingSetups/{billing_setup_id}B

start_timeB

end_timeB
_idB
_payments_accountB�
%com.google.ads.googleads.v8.resourcesBBillingSetupProtoPZJgoogle.golang.org/genproto/googleapis/ads/googleads/v8/resources;resources�GAA�!Google.Ads.GoogleAds.V8.Resources�!Google\\Ads\\GoogleAds\\V8\\Resources�%Google::Ads::GoogleAds::V8::Resourcesbproto3
�
<google/ads/googleads/v8/services/billing_setup_service.proto google.ads.googleads.v8.servicesgoogle/api/annotations.protogoogle/api/client.protogoogle/api/field_behavior.protogoogle/api/resource.proto"^
GetBillingSetupRequestD
resource_name (	B-�A�A\'
%googleads.googleapis.com/BillingSetup"�
MutateBillingSetupRequest
customer_id (	B�AO
	operation (27.google.ads.googleads.v8.services.BillingSetupOperationB�A"y
BillingSetupOperationA
create (2/.google.ads.googleads.v8.resources.BillingSetupH 
remove (	H B
	operation"h
MutateBillingSetupResponseJ
result (2:.google.ads.googleads.v8.services.MutateBillingSetupResult"1
MutateBillingSetupResult
resource_name (	2�
BillingSetupService�
GetBillingSetup8.google.ads.googleads.v8.services.GetBillingSetupRequest/.google.ads.googleads.v8.resources.BillingSetup"G���1//v8/{resource_name=customers/*/billingSetups/*}�Aresource_name�
MutateBillingSetup;.google.ads.googleads.v8.services.MutateBillingSetupRequest<.google.ads.googleads.v8.services.MutateBillingSetupResponse"U���7"2/v8/customers/{customer_id=*}/billingSetups:mutate:*�Acustomer_id,operationE�Agoogleads.googleapis.com�A\'https://www.googleapis.com/auth/adwordsB�
$com.google.ads.googleads.v8.servicesBBillingSetupServiceProtoPZHgoogle.golang.org/genproto/googleapis/ads/googleads/v8/services;services�GAA� Google.Ads.GoogleAds.V8.Services� Google\\Ads\\GoogleAds\\V8\\Services�$Google::Ads::GoogleAds::V8::Servicesbproto3'
        , true);
        static::$is_initialized = true;
    }
}


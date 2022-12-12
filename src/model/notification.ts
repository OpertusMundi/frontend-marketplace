import { QueryResultPage } from '@/model/request';
import { ServerResponse } from '@/model/response';
import { EnumCatalogueType } from '@/model/catalogue';

export enum EnumNotificationEventType {
  ASSET_PUBLISHED = 'ASSET_PUBLISHED',
  ASSET_PUBLISHING_ACCEPTED = 'ASSET_PUBLISHING_ACCEPTED',
  ASSET_PUBLISHING_CANCELLED = 'ASSET_PUBLISHING_CANCELLED',
  ASSET_PUBLISHING_REJECTED = 'ASSET_PUBLISHING_REJECTED',
  CATALOGUE_ASSET_UNPUBLISHED = 'CATALOGUE_ASSET_UNPUBLISHED',
  CATALOGUE_HARVEST_COMPLETED = 'CATALOGUE_HARVEST_COMPLETED',
  COPY_FILE_TO_TOPIO_DRIVE_ERROR = 'COPY_FILE_TO_TOPIO_DRIVE_ERROR',
  COPY_FILE_TO_TOPIO_DRIVE_SUCCESS = 'COPY_FILE_TO_TOPIO_DRIVE_SUCCESS',
  DELIVERY_REQUEST = 'DELIVERY_REQUEST',
  DIGITAL_DELIVERY = 'DIGITAL_DELIVERY',
  DIGITAL_DELIVERY_BY_PLATFORM = 'DIGITAL_DELIVERY_BY_PLATFORM',
  DIGITAL_DELIVERY_BY_SUPPLIER = 'DIGITAL_DELIVERY_BY_SUPPLIER',
  FILES_UPLOAD_COMPLETED = 'FILES_UPLOAD_COMPLETED',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  PHYSICAL_DELIVERY_BY_SUPPLIER = 'PHYSICAL_DELIVERY_BY_SUPPLIER',
  PURCHASE_APPROVED = 'PURCHASE_APPROVED',
  PURCHASE_REJECTED = 'PURCHASE_REJECTED',
  PURCHASE_REMINDER = 'PURCHASE_REMINDER',
  USER_SERVICE_PUBLISH_FAILURE = 'USER_SERVICE_PUBLISH_FAILURE',
  USER_SERVICE_PUBLISH_SUCCESS = 'USER_SERVICE_PUBLISH_SUCCESS',
  USER_SERVICE_REMOVE = 'USER_SERVICE_REMOVE',
}

export enum EnumNotificationSortField {
  SEND_AT = 'SEND_AT',
}

export interface AssetPublishedData {
  type: EnumNotificationEventType.ASSET_PUBLISHED;
  draftKey: string;
  assetId: string;
  assetName: string;
  assetVersion: string;
}

export interface AssetPublishingAcceptedData {
  type: EnumNotificationEventType.ASSET_PUBLISHING_ACCEPTED;
  draftKey: string;
  assetName: string;
  assetVersion: string;
}

interface AssetPublishingCancelledData {
  type: EnumNotificationEventType.ASSET_PUBLISHING_CANCELLED;
  draftKey: string;
  assetName: string;
  assetVersion: string;
  errorMessage: string;
}

interface AssetPublishingRejectedData {
  type: EnumNotificationEventType.ASSET_PUBLISHING_REJECTED;
  draftKey: string;
  assetName: string;
  assetVersion: string;
}

interface CatalogueAssetUnpublishedData {
  type: EnumNotificationEventType.CATALOGUE_ASSET_UNPUBLISHED;
  assetId: string;
  assetName: string;
  assetVersion: string;
  publisherKey: string;
}

interface CatalogueHarvestData {
  type: EnumNotificationEventType.CATALOGUE_HARVEST_COMPLETED;
  /**
   * Request catalogue URL
   */
  catalogueUrl: string;
  /**
   * Request catalogue type
   */
  catalogueType: EnumCatalogueType;
}

interface CopyTopioFileErrorData {
  type: EnumNotificationEventType.COPY_FILE_TO_TOPIO_DRIVE_ERROR;
  assetId: string;
  assetName: string;
  assetVersion: string;
  resourceKey: string;
  resourceFileName: string;
}

interface CopyTopioFileSuccessData {
  type: EnumNotificationEventType.COPY_FILE_TO_TOPIO_DRIVE_SUCCESS;
  assetId: string;
  assetName: string;
  assetVersion: string;
  resourceKey: string;
  resourceFileName: string;
}

export interface OrderDeliveryRequestData {
  type: EnumNotificationEventType.DELIVERY_REQUEST;
  orderKey: string;
  assetName: string;
}

interface OrderDigitalDeliveryData {
  type: EnumNotificationEventType.DIGITAL_DELIVERY;
  orderKey: string;
  assetName: string;
  assetVersion: string;
}

interface OrderDeliveryByPlatformData {
  type: EnumNotificationEventType.DIGITAL_DELIVERY_BY_PLATFORM;
  payInKey: string;
  orderKey: string;
  assetId: string;
  assetName: string;
  assetVersion: string;
}

interface OrderDeliveryByProviderData {
  type: EnumNotificationEventType.DIGITAL_DELIVERY_BY_SUPPLIER;
  payInKey: string;
  orderKey: string;
  assetId: string;
  assetName: string;
  assetVersion: string;
}

interface FilesUploadCompletedData {
  ype: EnumNotificationEventType.FILES_UPLOAD_COMPLETED;
}

interface OrderConfirmationData {
  type: EnumNotificationEventType.ORDER_CONFIRMATION;
  orderId: string;
  orderKey: string;
  payInKey: string;
}

interface OrderPhysicalDeliveryByProviderData {
  type: EnumNotificationEventType.PHYSICAL_DELIVERY_BY_SUPPLIER;
  payInKey: string;
  orderKey: string;
  assetId: string;
  assetName: string;
  assetVersion: string;
}

interface PurchaseApprovedData {
  type: EnumNotificationEventType.PURCHASE_APPROVED;
  orderId: string;
  orderKey: string;
  assetId: string;
  assetName: string;
  assetVersion: string;
  supplierName: string;
}

interface PurchaseRejectedData {
  type: EnumNotificationEventType.PURCHASE_REJECTED;
  orderId: string;
  orderKey: string;
  assetId: string;
  assetName: string;
  assetVersion: string;
  supplierName: string;
}

interface PurchaseReminderData {
  type: EnumNotificationEventType.PURCHASE_REMINDER;
  orderKey: string;
  assetName: string;
  assetVersion: string;
}

interface UserServicePublishFailureData {
  type: EnumNotificationEventType.USER_SERVICE_PUBLISH_FAILURE;
  serviceKey: string;
  serviceTitle: string;
  serviceVersion: string;
}

interface UserServicePublishSuccessData {
  type: EnumNotificationEventType.USER_SERVICE_PUBLISH_SUCCESS;
  serviceKey: string;
  serviceTitle: string;
  serviceVersion: string;
}

interface UserServiceRemoveData {
  type: EnumNotificationEventType.USER_SERVICE_REMOVE;
  serviceKey: string;
  serviceTitle: string;
  serviceVersion: string;
}

export type NotificationDataType =
  | AssetPublishedData
  | AssetPublishingAcceptedData
  | AssetPublishingCancelledData
  | AssetPublishingRejectedData
  | CatalogueAssetUnpublishedData
  | CatalogueHarvestData
  | CopyTopioFileErrorData
  | CopyTopioFileSuccessData
  | OrderDeliveryRequestData
  | OrderDigitalDeliveryData
  | OrderDeliveryByPlatformData
  | OrderDeliveryByProviderData
  | FilesUploadCompletedData
  | OrderConfirmationData
  | OrderPhysicalDeliveryByProviderData
  | PurchaseApprovedData
  | PurchaseRejectedData
  | PurchaseReminderData
  | UserServicePublishFailureData
  | UserServicePublishSuccessData
  | UserServiceRemoveData;

export interface Notification {
  /**
   * Notification unique identifier
   */
  id: string;
  /**
   * Notification text
   */
  text: string;
  /**
   * Date created in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  createdAt: string;
  /**
   * Date marked as read in ISO format e.g. 2020-06-10T16:01:04.991+03:00
   */
  readAt: string | null;
  /**
   * True if the user has viewed (read) the notification
   */
  read: boolean;
  /**
   * Notification user (for simple users, the recipient is always the same
   * as the currently authenticated user key)
   */
  recipient: string;
  /**
   * Event type
   */
  eventType: EnumNotificationEventType | null;
  /**
   * Notification extra data
   */
  data: NotificationDataType | null;
}

export type NotificationQueryResponse = ServerResponse<QueryResultPage<Notification>>;

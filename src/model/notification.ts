import { QueryResultPage } from '@/model/request';
import { ServerResponse } from '@/model/response';
import { EnumCatalogueType } from '@/model/catalogue';

export enum EnumNotificationEventType {
  CATALOGUE_ASSET_UNPUBLISHED = 'CATALOGUE_ASSET_UNPUBLISHED',
  CATALOGUE_HARVEST_COMPLETED = 'CATALOGUE_HARVEST_COMPLETED',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
  DELIVERY_REQUEST = 'DELIVERY_REQUEST',
  DIGITAL_DELIVERY = 'DIGITAL_DELIVERY',
  PURCHASE_REMINDER = 'PURCHASE_REMINDER',
  DIGITAL_DELIVERY_BY_SUPPLIER = 'DIGITAL_DELIVERY_BY_SUPPLIER',
  PHYSICAL_DELIVERY_BY_SUPPLIER = 'PHYSICAL_DELIVERY_BY_SUPPLIER',
  DIGITAL_DELIVERY_BY_PLATFORM = 'DIGITAL_DELIVERY_BY_PLATFORM',
  PURCHASE_APPROVED = 'PURCHASE_APPROVED',
  PURCHASE_REJECTED = 'PURCHASE_REJECTED',
  FILES_UPLOAD_COMPLETED = 'FILES_UPLOAD_COMPLETED',
  ASSET_PUBLISHING_ACCEPTED = 'ASSET_PUBLISHING_ACCEPTED',
  ASSET_PUBLISHING_REJECTED = 'ASSET_PUBLISHING_REJECTED',
  ASSET_PUBLISHING_CANCELLED = 'ASSET_PUBLISHING_CANCELLED',
  ASSET_PUBLISHED = 'ASSET_PUBLISHED',
  COPY_FILE_TO_TOPIO_DRIVE_SUCCESS = 'COPY_FILE_TO_TOPIO_DRIVE_SUCCESS',
  COPY_FILE_TO_TOPIO_DRIVE_ERROR = 'COPY_FILE_TO_TOPIO_DRIVE_ERROR',
  USER_SERVICE_PUBLISH_SUCCESS = 'USER_SERVICE_PUBLISH_SUCCESS',
  USER_SERVICE_PUBLISH_FAILURE = 'USER_SERVICE_PUBLISH_FAILURE',
  USER_SERVICE_REMOVE = 'USER_SERVICE_REMOVE',
}

export enum EnumNotificationSortField {
  SEND_AT = 'SEND_AT',
}

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
  eventType: EnumNotificationEventType | null,
}

export interface CatalogueHarvestNotification extends Notification {
  /**
   * Additional information specific to the event type
   */
  data: {
    /**
     * Request catalogue URL
     */
    catalogueUrl: string;
    /**
     * Request catalogue type
     */
    catalogueType: EnumCatalogueType;
  } | null;
}

export type NotificationQueryResponse = ServerResponse<QueryResultPage<Notification>>;

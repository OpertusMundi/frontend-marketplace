import { QueryResultPage } from '@/model/request';
import { ServerResponse } from '@/model/response';
import { EnumCatalogueType } from '@/model/catalogue';

export enum EnumNotificationEventType {
  CATALOGUE_HARVEST_COMPLETED = 'CATALOGUE_HARVEST_COMPLETED',
}

interface Notification {
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

import { CatalogueItemCommand, Publisher } from '@/model/catalogue';

export enum EnumDraftStatus {
  /**
   * Asset is editable
   */
  DRAFT = 'DRAFT',
  /**
   * Asset is submitted and automated metadata is being computed
   */
  SUBMITTED = 'SUBMITTED',
  /**
   * Automated metadata has been computed and HelpDesk review is required
   */
  PENDING_HELPDESK_REVIEW = 'PENDING_HELPDESK_REVIEW',
  /**
   * HelpDesk user rejects the asset
   */
  HELPDESK_REJECTED = 'HELPDESK_REJECTED',
  /**
   * HelpDesk user accepts the asset. Provider review is required. Provider
   * may adjust the visibility of the metadata
   */
  PENDING_PROVIDER_REVIEW = 'PENDING_PROVIDER_REVIEW',
  /**
   * Provider rejects the asset
   */
  PROVIDER_REJECTED = 'PROVIDER_REJECTED',
  /**
   * Provider accepted the asset and final post-processing actions are executed
   */
  POST_PROCESSING = 'POST_PROCESSING',
  /**
   * Draft is published
   */
  PUBLISHED = 'PUBLISHED',
}

export enum EnumSortField {
  CREATED_ON = 'CREATED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  PROVIDER = 'PROVIDER',
  STATUS = 'STATUS',
  TITLE = 'TITLE',
  VERSION = 'VERSION',
}

export interface AssetDraftQuery {
  status: EnumDraftStatus[];
}

export interface AssetDraft {
  assetDraft: string;
  assetPublished: string;
  command: CatalogueItemCommand;
  createdOn: string;
  status: EnumDraftStatus;
  helpdeskRejectionReason: string;
  ingested: boolean;
  key: string;
  modifiedOn: string;
  providerRejectionReason: string;
  publisher: Publisher,
  source: string;
  title: string;
  version: string;
}

export interface AssetDraftReviewCommand {
  rejected: boolean;
  reason?: string;
}

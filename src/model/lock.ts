export enum EnumRecordLock {
  DRAFT = 'DRAFT',
}

export interface RecordLock {
  /**
   * When the lock has been created
   */
  createdOn: string;
  /**
   * User name (email)
   */
  ownerEmail: string;
  /**
   * User unique key
   */
  ownerKey: string;
  /**
   * Record type
   */
  recordType: EnumRecordLock;
}

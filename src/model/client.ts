export interface Client {
  /**
   * User-defined client name
   */
  alias: string,
  /**
   * Client id
   */
  clientId: string,
  /**
   * 
   */
  createdOn: string,
  /**
   * 
   */
  revokedOn: string,
  /**
   * Client secret. Available only the first time a client is created
   */
  secret: string,
}

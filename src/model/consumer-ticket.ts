export enum EnumConsumerTicketType {
  ORDER = 'ORDER',
  PAYIN = 'PAYIN',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PRIVATE_OGC_SERVICE = 'PRIVATE_OGC_SERVICE',
  OTHER = 'OTHER',
}

export interface ConsumerTicketCommand {
  resourceKey: string,
  text: string,
  type: EnumConsumerTicketType,
}

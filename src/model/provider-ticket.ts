export enum EnumProviderTicketType {
  ORDER = 'ORDER',
}

export interface ProviderTicketCommand {
  resourceKey: string,
  text: string,
  type: EnumProviderTicketType,
}

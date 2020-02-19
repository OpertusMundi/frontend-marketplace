export enum EnumLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface ServerError {
  code: string;
  level: EnumLevel;
  description: string;
}

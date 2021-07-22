export enum EnumContractStatus {
  DRAFT = 'DRAFT',
  HISTORY = 'HISTORY',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PUBLISHED = 'PUBLISHED',
}

export enum EnumMasterContractSortField {
  CREATED_ON = 'CREATED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  STATUS = 'STATUS',
  TITLE = 'TITLE',
  VERSION = 'VERSION',
}

export enum EnumProviderContractSortField {
  CREATED_ON = 'CREATED_ON',
  MODIFIED_ON = 'MODIFIED_ON',
  STATUS = 'STATUS',
  TITLE = 'TITLE',
  VERSION = 'VERSION',
}

export interface SubOption {
  id: number;
  body: string;
}

export interface MasterSection {
  id: number | null;
  indent: number;
  index: string;
  title: string;
  variable: boolean;
  optional: boolean;
  dynamic: boolean;
  options: string[];
  styledOptions: string[];
  subOptions: { [key: number]: SubOption[] }
  summary?: string[];
  icons?: string[];
  descriptionOfChange: string;
}

export interface MasterContract {
  createdAt: string;
  key: string;
  modifiedAt: string;
  sections: MasterSection[],
  subtitle?: string;
  title: string;
  version: string;
}

export interface MasterContractHistory extends MasterContract {
  status: EnumContractStatus;
}

export interface ProviderTemplateSection {
  id?: number;
  /**
   * Master contract section identifier
   */
  masterSectionId: number;
  /**
   * Optional
   */
  optional: boolean;
  /**
   * Option identifier
   */
  option: number | null;
  /**
   * Sub-option identifier
   */
  subOption: number | null;
}

export interface ProviderTemplateContract {
  /**
   * Unique key
   */
  key: string;
  /**
   * Master template ke
   */
  templateKey: string;
  /**
   * Title
   */
  title: string;
  /**
   * Subtitle
   */
  subtitle: string;
  /**
   * Version
   */
  version: string;
  /**
   * Date of creation in ISO format
   */
  createdAt: string;
  /**
   * Date of last update in ISO format
   */
  modifiedAt: string;
  /**
   * Sections
   */
  sections?: ProviderTemplateSection[];
  /**
   * Parent master contract
   */
  masterContract?: MasterContractHistory;
}

export interface ProviderTemplateContractCommand {
  /**
   * Master template key
   */
  templateKey: string;
  /**
   * Title
   */
  title: string;
  /**
   * Subtitle
   */
  subtitle: string;
  /**
   * Sections
   */
  sections: ProviderTemplateSection[];
}

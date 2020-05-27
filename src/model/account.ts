import { EnumRole } from './role';

interface ProfileBase {
  email?: string;
  image?: string;
  imageMimeType?: string;
}

export interface Profile extends ProfileBase {
  createdOn: string;
  modifiedOn: string;
}

export interface ProfileCommand extends ProfileBase {
}

export interface Account {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  locale: string;
  registeredAt: string;
  roles: EnumRole[];
  alias: string;
  imageUrl: string;
  profile: Profile;
}


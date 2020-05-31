import { EnumRole } from './role';

/**
 * Profile base class
 */
interface ProfileBase {
  /**
   * Authenticated user public email
   */
  email?: string;
  /**
   * Base64 encoded user image
   */
  image?: string;
  /**
   * Image mime type (used with image property to create a data URL)
   */
  imageMimeType?: string;
}

/**
 * Account profile
 */
export interface Profile extends ProfileBase {
  /**
   * Date of creation (equal with account registration date)
   */
  createdOn: string;
  /**
   * Date of the most recent update
   */
  modifiedOn: string;
}

/**
 * Profile update command
 */
export interface ProfileCommand extends ProfileBase {
}

/**
 * User account
 */
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


interface Resources {
  memoryLimit: number;
  cpuLimit: number;

}
export interface JupyterHubProfile {
  /**
   * A human-friendly name for this profile
   */
  name: string;
  /**
   * Profile description
   */
  description: string;
  /**
   * Represents the amount of (compute) resources available to this profile
   */
  resources: Resources;
  /**
   * The names of (JupyterHub) user groups that are allowed to use this profile
   */
  groups: string[];
}

export interface JupyterConfiguration {
  /**
   * Available profiles
   */
  profiles: JupyterHubProfile[];
  /**
   * User groups
   */
  groups: string[];
  /**
   * Profile of running server
   */
  activeProfile: string | null
}

export interface JupyterUserStatus {
  /**
   * True if the server is ready
   */
  ready: boolean;
  /**
   * The URL to the running notebook server
   */
  path: string | null;
  /**
   * Profile of running server
   */
  profile: string;
}

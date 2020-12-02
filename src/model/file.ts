interface FileSystemEntry {
  /**
   * Last modified date (server time)
   */
  modifiedOn: string;
  /**
   * File name
   */
  name: string;
  /**
   * File path
   */
  path: string;
  /**
   * File size in bytes
   */
  size: number;
}

export interface FileInfo extends FileSystemEntry {

}

export interface DirectoryInfo extends FileSystemEntry {
  /**
   * Total number of files and folders in this directory
   */
  count: number;
  /**
   * Files in directory
   */
  files: FileInfo[];
  /**
   * Folders in directory
   */
  folders: DirectoryInfo[];
  /**
   * Size of all files in this directory (including all child directories) in bytes
   */
  size: number;
}

export interface FilePathCommand {
  /**
   * An absolute path in user's remote file system. A leading slash is optional e.g. "/tutorial"
   */
  path: string;
}

export interface FileUploadCommand {
  comment?: string;
  filename: string;
  /**
   * True if an existing file should be overwritten
   */
  overwrite?: boolean;
  /**
   * Absolute path in the user's remote file system where file will be saved
   */
  path: string;
}

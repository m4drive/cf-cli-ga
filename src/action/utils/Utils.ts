/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable filenames/match-regex */
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import os from 'os';

export class Utils {
  private static binaryPath = '';
  static CF_DEFAULT_INSTALLATION_PATH = './cf8';
  static CF_INSTALLATION_CHECK_COMMAND = '-v';
  static CF_AUTH_ALIVE_COMMAND = 'oauth-token';
  static EXECUTABLE_PATH_VARIANTS = [
    'cf',
    'cf7',
    'cf8',
    `${Utils.getDefaultInstallationPath()}/cf${Utils.getOSSpecificExtension()}`,
    `${Utils.getDefaultInstallationPath()}/cf7${Utils.getOSSpecificExtension()}`,
    `${Utils.getDefaultInstallationPath()}/cf8${Utils.getOSSpecificExtension()}`
  ];
  static getDefaultInstallationPath(): string {
    return Utils.CF_DEFAULT_INSTALLATION_PATH;
  }
  static getOSSpecificExtension(): string {
    if (os.type() === 'Windows_NT') return '.exe';
    return '';
  }
  static async isCFInstalled(): Promise<boolean> {
    try {
      await Utils.getCFBinaryLocation();
      return true;
    } catch (e) {
      return false;
    }
  }
  static async getCFBinaryLocation(): Promise<string> {
    if (Utils.binaryPath.length > 0) return Utils.binaryPath;
    for (let i = 0; i < Utils.EXECUTABLE_PATH_VARIANTS.length; i++) {
      const cfCliPath = Utils.EXECUTABLE_PATH_VARIANTS[i];
      try {
        await exec.exec(
          `${cfCliPath} ${Utils.CF_INSTALLATION_CHECK_COMMAND}`,
          [],
          {silent: true}
        );
        Utils.binaryPath = cfCliPath;
        break;
      } catch (e) {
        //core.info(`Exception: ${e}`);
      }
    }
    if (Utils.binaryPath.length === 0)
      throw new Error('CF binary path not found');
    return Utils.binaryPath;
  }

  static async downloadAndUnpack(url: string, path: string): Promise<void> {
    const filePath = await tc.downloadTool(url);
    if (process.platform === 'win32') {
      await tc.extractZip(filePath, path);
    } else if (process.platform === 'darwin') {
      await tc.extractXar(filePath, path);
    } else {
      await tc.extractTar(filePath, path);
    }
  }

  static async authIsAlive(): Promise<boolean> {
    try {
      await exec.exec(
        `${Utils.getCFBinaryLocation()} ${Utils.CF_AUTH_ALIVE_COMMAND}`,
        [],
        {silent: true}
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}

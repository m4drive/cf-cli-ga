/* eslint-disable filenames/match-regex */
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import os from 'os';
import fs from 'fs';

export class Utils {
  private static binaryPath = '';
  static CF_DEFAULT_INSTALLATION_PATH = './cf8';
  static CF_INSTALLATION_CHECK_COMMAND = '-v';
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
    const cliPath = Utils.EXECUTABLE_PATH_VARIANTS.find(async cfCliPath => {
      try {
        await exec.exec(`${cfCliPath} ${Utils.CF_INSTALLATION_CHECK_COMMAND}`);
        return true;
      } catch (e) {
        return false;
      }
    });
    if (typeof cliPath == 'undefined')
      throw new Error('CF binary path not found');
    return cliPath;
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
}
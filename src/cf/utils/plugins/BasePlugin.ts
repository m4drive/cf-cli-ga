/* eslint-disable filenames/match-regex */

import * as exec from '@actions/exec';
import {Utils} from '../Utils';

export class BasePlugin {
  getCheckCommand(): string {
    throw new Error('Not implemented');
  }
  getInstallCommand(): string {
    throw new Error('Not implemented');
  }
  async isInstalled(): Promise<boolean> {
    try {
      await exec.exec(
        `${await Utils.getCFBinaryLocation()} ${this.getCheckCommand()}`,
        [],
        {silent: true}
      );
      return true;
    } catch (e) {
      return false;
    }
  }
  async install(): Promise<void> {
    if (!this.isInstalled()) {
      await exec.exec(
        `${await Utils.getCFBinaryLocation()} ${this.getInstallCommand()}`
      );
    }
  }
}

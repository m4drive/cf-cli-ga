/* eslint-disable filenames/match-regex */
import {BasePlugin} from './BasePlugin';

export class BlueGreenDeployPlugin extends BasePlugin {
  getCheckCommand(): string {
    return `bgd -h`;
  }
  getInstallCommand(): string {
    return `install-plugin blue-green-deploy -f -r CF-Community`;
  }
}

/* eslint-disable filenames/match-regex */
import {BasePlugin} from './BasePlugin';

export class MultiappsPlugin extends BasePlugin {
  getCheckCommand(): string {
    return `deploy -h`;
  }
  getInstallCommand(): string {
    return `install-plugin multiapps -f`;
  }
}

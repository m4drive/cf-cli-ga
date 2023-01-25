/* eslint-disable filenames/match-regex */
import {BasePlugin} from './BasePlugin';

export class Html5Plugin extends BasePlugin {
  getCheckCommand(): string {
    return `html5-list -h`;
  }
  getInstallCommand(): string {
    return `install-plugin -r CF-Community "html5-plugin" -f`;
  }
}

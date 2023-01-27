/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable filenames/match-regex */
import {BasePlugin} from './BasePlugin';
import {BlueGreenDeployPlugin} from './BlueGreenDeployPlugin';
import {Html5Plugin} from './Html5Plugin';
import {MultiappsPlugin} from './MultiappsPlugin';

export class PluginFactory {
  static getPluginByName(pluginName: String): BasePlugin {
    switch (pluginName) {
      case 'multiapps':
        return new MultiappsPlugin();
      case 'html5-plugin':
        return new Html5Plugin();
      case 'blue-green-deploy':
        return new BlueGreenDeployPlugin();
      default:
        throw new Error(
          `No installation realization for plugin: ${pluginName}`
        );
    }
  }
}

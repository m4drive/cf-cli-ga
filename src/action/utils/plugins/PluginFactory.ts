/* eslint-disable filenames/match-regex */
import {BasePlugin} from './BasePlugin';
import {Html5Plugin} from './Html5Plugin';
import {MultiappsPlugin} from './MultiAppsPlugin';

export class PluginFactory {
  static getPluginByName(pluginName: String): BasePlugin {
    switch (pluginName) {
      case 'multiapps':
        return new MultiappsPlugin();
      case 'html5-plugin':
        return new Html5Plugin();
      default:
        throw new Error(
          `No installation realization for plugin: ${pluginName}`
        );
    }
  }
}

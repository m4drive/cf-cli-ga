/* eslint-disable github/array-foreach */
/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import * as fs from 'fs';
import os from 'os';
import {BaseAction, InputSchema} from '../BaseAction';
import {IActionRuns, UsingEnum} from '../../schema/ActionRuns';
import {IActionOutputs} from '../../schema/ActionOutputs';
import {installCLIInputs} from './InstallCLIInputs';
import {Utils} from '../utils/Utils';
import {PluginFactory} from '../utils/plugins/PluginFactory';

export class InstallCLIAction extends BaseAction {
  CF_EXECUTABLE_VARIANTS = ['cf', 'cf7', 'cf8'].map(
    variant => `${variant}${Utils.getOSSpecificExtension()}`
  );
  getName(): string {
    return 'cf-install-cli';
  }
  getDescription(): string {
    return 'Install CF CLI';
  }
  getAuthor(): string {
    return '';
  }
  getRuns(): IActionRuns {
    return {
      using: UsingEnum.node16,
      main: '../../dist/install-cli/index.js'
    };
  }
  getOutputs(): IActionOutputs | undefined {
    return undefined;
  }
  getInputSchema(): InputSchema[] {
    return [...installCLIInputs];
  }
  getHideOutput(): boolean {
    return false;
  }
  getBaseCommand(): string {
    return '';
  }
  async run(): Promise<void> {
    try {
      const cfInstallationPathLinux: string = core.getInput(
        'cfInstallationPathLinux'
      );
      const cfInstallationPathWindows: string = core.getInput(
        'cfInstallationPathWindows'
      );
      const cfInstallationPathMac: string = core.getInput(
        'cfInstallationPathMac'
      );
      const plugins: string = core.getInput('plugins');
      //check if CF installed
      if (await Utils.isCFInstalled()) {
        core.info('CF CLI detected, skipping installation step!');
      } else {
        core.info('CF CLI not detected starting installation!');
        const defaultInstallationPath = Utils.getDefaultInstallationPath();
        switch (os.type()) {
          case 'Darwin':
            await Utils.downloadAndUnpack(
              cfInstallationPathMac,
              defaultInstallationPath
            );
            break;
          case 'Windows_NT':
            await Utils.downloadAndUnpack(
              cfInstallationPathWindows,
              defaultInstallationPath
            );
            break;
          case 'Linux':
          default:
            await Utils.downloadAndUnpack(
              cfInstallationPathLinux,
              defaultInstallationPath
            );
            break;
        }
        this.CF_EXECUTABLE_VARIANTS.map(
          variant => `${defaultInstallationPath}/${variant}`
        )
          .filter(executablePath => fs.existsSync(executablePath))
          .forEach(executablePath => fs.chmodSync(executablePath, 777));
      }
      // validate installation
      if (!(await Utils.isCFInstalled())) {
        throw new Error('Failed to install CF CLI!');
      }
      // install plugins
      const pluginsNameList = plugins
        .toLowerCase()
        .split(',')
        .map(pluginName => pluginName.trim())
        .filter(pluginName => pluginName.length > 0);
      core.info(`Detected required plugins: ${pluginsNameList}`);
      for (const pluginName of pluginsNameList) {
        core.info(`Installing plugin: ${pluginName}`);
        await PluginFactory.getPluginByName(pluginName).install();
      }
    } catch (e) {
      core.setFailed(String(e));
    }
  }
}

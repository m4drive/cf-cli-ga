/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prettier/prettier */
/* eslint-disable github/array-foreach */
import * as core from '@actions/core';
import * as fs from 'fs';
import os from 'os';
import {Utils} from '../utils/Utils';
import { PluginFactory } from '../utils/plugins/PluginFactory';

const CF_EXECUTABLE_VARIANTS = ['cf', 'cf7', 'cf8'].map(
  variant => `${variant}${Utils.getOSSpecificExtension()}`
);
async function run(): Promise<void> {
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
    const plugins: string = core.getInput('cfInstallationPathMac');
    //check if CF installed
    if (await Utils.isCFInstalled()) {
      core.info('CF CLI detected, skipping installation step!');
    } else {
      core.info('CF CLI not detected starting installation!');
      const defaultInstallationPath = Utils.getDefaultInstallationPath();
      switch (os.type()) {
        case 'Darwin':
          await Utils.downloadAndUnpack(cfInstallationPathMac, defaultInstallationPath);
          break;
        case 'Windows_NT':
          await Utils.downloadAndUnpack(cfInstallationPathWindows,defaultInstallationPath);
          break;
        case 'Linux':
        default:
          await Utils.downloadAndUnpack(cfInstallationPathLinux,defaultInstallationPath);
          break;
      }
      CF_EXECUTABLE_VARIANTS.map(variant => `${defaultInstallationPath}/${variant}`)
        .filter(executablePath => fs.existsSync(executablePath))
        .forEach(executablePath => fs.chmodSync(executablePath, 777));
    }
    // validate installation
    if (!(await Utils.isCFInstalled())){
      throw new Error("Failed to install CF CLI!");
    }
    // install plugins
    const pluginsNameList = plugins.toLowerCase().split(',')
      .map(pluginName=>pluginName.trim())
      .filter(pluginName => pluginName.length>0);
    for (let i=0;i<pluginsNameList.length;i++){
      await PluginFactory.getPluginByName(pluginsNameList[i]).install();
    }
  } catch (e) {
    core.setFailed(String(e));
  }
}

run();

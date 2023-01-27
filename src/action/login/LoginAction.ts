/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import {IActionOutputs} from '../../schema/ActionOutputs';
import {IActionRuns, UsingEnum} from '../../schema/ActionRuns';
import {BaseAction, InputSchema} from '../BaseAction';
import {baseInputs} from '../BaseInputs';
import {loginInputs} from './LoginInputs';

export class LoginAction extends BaseAction {
  getName(): string {
    return 'cf-login';
  }
  getDescription(): string {
    return 'CF login wrapper';
  }
  getAuthor(): string {
    return '';
  }
  getRuns(): IActionRuns {
    return {
      using: UsingEnum.node16,
      main: '../../dist/login/index.js'
    };
  }
  getOutputs(): IActionOutputs | undefined {
    return undefined;
  }
  getInputSchema(): InputSchema[] {
    return [...loginInputs, ...baseInputs];
  }
  getBaseCommand(): string {
    return 'login';
  }
  getHideOutput(): boolean {
    return false;
  }
  async run(): Promise<void> {
    const manualLogin = core.getInput('manualLogin') === 'true' ? true : false;
    if (manualLogin) {
      core.info('Detected manualLogin skipping auto-login!');
    } else {
      await super.run();
    }
  }
}

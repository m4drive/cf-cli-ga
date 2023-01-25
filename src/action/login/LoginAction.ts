/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import {BaseAction, InputSchema} from '../BaseAction';
import {loginInputs} from './LoginInputs';

export class LoginAction extends BaseAction {
  getInputSchema(): InputSchema[] {
    return [...loginInputs];
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

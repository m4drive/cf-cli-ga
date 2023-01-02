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
    const inputs = this.getInput();
    const manualLogin = (await inputs).find(
      input => input.inputFieldName === 'manualLogin'
    );
    if (typeof manualLogin != 'undefined' && manualLogin.value === true) {
      core.info('Detected manualLogin skipping auto-login!');
      return;
    }
    await super.run();
  }
}

/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import {BaseAction, InputSchema, SimpleTypes} from '../BaseAction';

export class LogoutAction extends BaseAction {
  getInputSchema(): InputSchema[] {
    return [
      {
        inputFieldName: 'manualLogin',
        getCommandParameter() {
          return '';
        },
        type: SimpleTypes.boolean
      }
    ];
  }
  getBaseCommand(): string {
    return 'logout';
  }
  getHideOutput(): boolean {
    return true;
  }
  async run(): Promise<void> {
    const inputs = this.getInput();
    const manualLogin = (await inputs).find(
      input => input.inputFieldName === 'manualLogin'
    );
    if (typeof manualLogin != 'undefined' && manualLogin.value === true) {
      core.info('Detected manualLogin skipping auto-logout!');
      return;
    }
    await super.run();
  }
}

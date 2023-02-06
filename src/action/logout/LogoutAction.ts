/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import {IActionOutputs} from '../../schema/ActionOutputs';
import {IActionRuns, UsingEnum} from '../../schema/ActionRuns';
import {BaseAction, InputSchema, SimpleTypes} from '../BaseAction';

export class LogoutAction extends BaseAction {
  getName(): string {
    return 'cf-logout';
  }
  getDescription(): string {
    return 'CF logout wrapper';
  }
  getAuthor(): string {
    return '';
  }
  getRuns(): IActionRuns {
    return {
      using: UsingEnum.node16,
      main: 'index.js'
    };
  }
  getOutputs(): IActionOutputs | undefined {
    return undefined;
  }
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

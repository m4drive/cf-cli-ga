/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import {IActionOutputs} from '../../schema/ActionOutputs';
import {IActionRuns, UsingEnum} from '../../schema/ActionRuns';
import {BaseAction, InputSchema} from '../BaseAction';
import {commandInputs} from './CommandInputs';
import {loginInputs} from '../login/LoginInputs';
import {baseInputs} from '../BaseInputs';

export class CommandAction extends BaseAction {
  getName(): string {
    return 'cf-command';
  }
  getDescription(): string {
    return 'CF generic command';
  }
  getAuthor(): string {
    return '';
  }
  getRuns(): IActionRuns {
    return {
      using: UsingEnum.node16,
      main: '../../dist/command/index.js',
      pre: '../../dist/login/index.js',
      post: '../../dist/logout/index.js'
    };
  }
  getOutputs(): IActionOutputs | undefined {
    return undefined;
  }
  getInputSchema(): InputSchema[] {
    return [
      ...loginInputs.map(input => {
        input.required = false;
        return input;
      }),
      ...commandInputs,
      ...baseInputs
    ];
  }
  getBaseCommand(): string {
    return core.getInput('command');
  }
  getHideOutput(): boolean {
    return core.getInput('hideOutput') === 'true';
  }
  async run(): Promise<void> {
    await super.run();
  }
}

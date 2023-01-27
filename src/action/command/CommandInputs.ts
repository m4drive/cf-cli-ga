/* eslint-disable filenames/match-regex */
import {InputSchema, SimpleTypes} from '../BaseAction';

export const commandInputs: InputSchema[] = [
  {
    inputFieldName: 'command',
    description: 'Any cf <command>',
    type: SimpleTypes.string,
    required: true,
    getCommandParameter() {
      return '';
    }
  },
  {
    inputFieldName: 'hideOutput',
    description: 'If output of command should be hidden',
    type: SimpleTypes.string,
    required: false,
    getCommandParameter() {
      return '';
    }
  }
];

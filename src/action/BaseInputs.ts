/* eslint-disable filenames/match-regex */
import {InputSchema, SimpleTypes} from './BaseAction';

export const baseInputs: InputSchema[] = [
  {
    inputFieldName: 'flags',
    description: 'CF command flags text',
    type: SimpleTypes.string,
    required: false,
    getCommandParameter(value) {
      return ` ${value}`;
    }
  }
];

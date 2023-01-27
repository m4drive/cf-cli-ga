/* eslint-disable filenames/match-regex */
import {InputSchema, SimpleTypes} from '../BaseAction';

export const loginInputs: InputSchema[] = [
  {
    inputFieldName: 'manualLogin',
    type: SimpleTypes.boolean,
    getCommandParameter() {
      return '';
    }
  },
  {
    inputFieldName: 'apiUrl',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-a ${value}`;
    },
    required: true
  },
  {
    inputFieldName: 'organization',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-o ${value}`;
    },
    required: true
  },
  {
    inputFieldName: 'space',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-s ${value}`;
    },
    required: true
  },
  {
    inputFieldName: 'user',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-u ${value}`;
    },
    required: true,
    isSecret: true
  },
  {
    inputFieldName: 'password',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-p ${value}`;
    },
    required: true,
    isSecret: true
  },
  {
    inputFieldName: 'skipSSLValidation',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? '--skip-ssl-validation' : '';
    }
  },
  {
    inputFieldName: 'origin',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `--origin ${value}`;
    }
  },
  {
    inputFieldName: 'credentials',
    type: SimpleTypes.string,
    getCommandParameter() {
      return '';
    },
    isJsonParameters: true
  }
];

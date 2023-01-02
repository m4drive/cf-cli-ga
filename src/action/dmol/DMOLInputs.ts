/* eslint-disable filenames/match-regex */
import {InputSchema, SimpleTypes} from '../BaseAction';

export const dmolInputs: InputSchema[] = [
  {
    inputFieldName: 'operationId',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-i ${value}`;
    }
  },
  {
    inputFieldName: 'mtaId',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `--mta ${value}`;
    }
  },
  {
    inputFieldName: 'last',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `--last ${value}`;
    }
  },
  {
    inputFieldName: 'directory',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-d ${value}`;
    }
  },
  {
    inputFieldName: 'deoployServiceUrl',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `--mta ${value}`;
    }
  },
  {
    inputFieldName: 'saveDMOLToArtifactory',
    type: SimpleTypes.boolean,
    getCommandParameter() {
      return ``;
    }
  },
  {
    inputFieldName: 'dmolArtifactName',
    type: SimpleTypes.string,
    getCommandParameter() {
      return ``;
    }
  }
];

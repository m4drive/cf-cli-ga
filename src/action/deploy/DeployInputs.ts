/* eslint-disable filenames/match-regex */
import {InputSchema, SimpleTypes} from '../BaseAction';

export const deployInputs: InputSchema[] = [
  {
    inputFieldName: 'mtaFile',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `${value}`;
    },
    required: true
  },
  {
    inputFieldName: 'modules',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-m ${value}`;
    }
  },
  {
    inputFieldName: 'resources',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-r ${value}`;
    }
  },
  {
    inputFieldName: 'operationId',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-i ${value}`;
    }
  },
  {
    inputFieldName: 'action',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-a ${value}`;
    }
  },
  {
    inputFieldName: 'extDescriptor',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-e ${value}`;
    }
  },
  {
    inputFieldName: 'timeout',
    type: SimpleTypes.number,
    getCommandParameter(value) {
      return `-t ${value}`;
    }
  },
  {
    inputFieldName: 'versionRule',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `--version-rule ${value}`;
    }
  },
  {
    inputFieldName: 'deployServiceUrl',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `-u ${value}`;
    }
  },
  {
    inputFieldName: 'force',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `-f` : ``;
    }
  },
  {
    inputFieldName: 'retries',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `--retries ${value}`;
    }
  },
  {
    inputFieldName: 'noStart',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--no-start` : ``;
    }
  },
  {
    inputFieldName: 'namespace',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `--namespace ${value}`;
    }
  },
  {
    inputFieldName: 'deleteService',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--delete-service` : ``;
    }
  },
  {
    inputFieldName: 'deleteServiceKeys',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--delete-service-keys` : ``;
    }
  },
  {
    inputFieldName: 'deleteServiceBrokers',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--delete-service-brokers` : ``;
    }
  },
  {
    inputFieldName: 'keepFiles',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--keep-files` : ``;
    }
  },
  {
    inputFieldName: 'noRestartSubscribedApps',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--no-restart-subscribed-apps` : ``;
    }
  },
  {
    inputFieldName: 'doNotFailOnMissingPermissions',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--do-not-fail-on-missing-permissions` : ``;
    }
  },
  {
    inputFieldName: 'abortOnError',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--abort-on-error` : ``;
    }
  },
  {
    inputFieldName: 'verifyArchiveSignature',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--verify-archive-signature` : ``;
    }
  },
  {
    inputFieldName: 'strategy',
    type: SimpleTypes.string,
    getCommandParameter(value) {
      return `--strategy ${value}`;
    }
  },
  {
    inputFieldName: 'skipTestingPhase',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--skip-testing-phase` : ``;
    }
  },
  {
    inputFieldName: 'skipIdleStart',
    type: SimpleTypes.boolean,
    getCommandParameter(value) {
      return value ? `--skip-idle-start` : ``;
    }
  },
  {
    inputFieldName: 'saveDMOLOn',
    type: SimpleTypes.string,
    getCommandParameter() {
      return '';
    }
  }
];

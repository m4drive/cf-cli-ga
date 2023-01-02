import {UsingEnum} from '../../action-metadata-schema/ActionRuns';
import {Action} from '../../action-metadata-schema/Action';
import {LoginInputs} from './blocks/loginInputs';

export const DeployAction = new Action({
  name: 'cf-deploy',
  description: 'CF deploy wrapper',
  author: 'Your name or organization here',
  inputs: {
    ...LoginInputs,
    ...{
      mtaPath: {
        required: false,
        description: 'path to mta'
      },
      mtaFile: {
        required: false,
        description: ' '
      },
      modules: {
        required: false,
        description: ' '
      },
      resources: {
        required: false,
        description: ' '
      },
      operationId: {
        required: false,
        description: ' '
      },
      action: {
        required: false,
        description: ' '
      },
      extDescriptor: {
        required: false,
        description: ' '
      },
      timeout: {
        required: false,
        description: ' '
      },
      versionRule: {
        required: false,
        description: ' '
      },
      deployServiceUrl: {
        required: false,
        description: ' '
      },
      force: {
        required: false,
        description: ' '
      },
      retries: {
        required: false,
        description: ' '
      },
      noStart: {
        required: false,
        description: ' '
      },
      namespace: {
        required: false,
        description: ' '
      },
      deleteService: {
        required: false,
        description: ' '
      },
      deleteServiceKeys: {
        required: false,
        description: ' '
      },
      deleteServiceBrokers: {
        required: false,
        description: ' '
      },
      keepFiles: {
        required: false,
        description: ' '
      },
      noRestartSubscribedApps: {
        required: false,
        description: ' '
      },
      doNotFailOnMissingPermissions: {
        required: false,
        description: ' '
      },
      abortOnError: {
        required: false,
        description: ' '
      },
      verifyArchiveSignature: {
        required: false,
        description: ' '
      },
      strategy: {
        required: false,
        description: ' '
      },
      skipTestingPhase: {
        required: false,
        description: ' '
      },
      skipIdleStart: {
        required: false,
        description: ' '
      },
      saveDMOLOn: {
        required: false,
        description: ' '
      },
      flags: {
        required: false,
        description: ' ',
        default: ' '
      }
    }
  },
  outputs: {
    deploymentId: {
      description: 'Id of CF mtar deployment.'
    }
  },
  runs: {
    using: UsingEnum.node16,
    main: '../../dist/deploy/index.js',
    pre: '../../dist/login/index.js',
    post: '../../dist/logout/index.js'
  }
});

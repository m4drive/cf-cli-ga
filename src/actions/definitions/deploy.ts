import {UsingEnum} from '../../github/ActionRuns';
import {Action} from './../../github/Action';
import {InstallationInputs} from './blocks/installationInputs';
import {LoginInputs} from './blocks/loginInputs';

export const DeployAction = new Action({
  name: 'cf-deploy',
  description: 'CF deploy wrapper',
  author: 'Your name or organization here',
  inputs: {
    ...LoginInputs,
    ...InstallationInputs,
    ...{
      mtaPath: {
        required: true,
        description: 'path to mta'
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
    main: 'dist/deploy2/index.js',
    pre: 'dist/login/index.js'
  }
});

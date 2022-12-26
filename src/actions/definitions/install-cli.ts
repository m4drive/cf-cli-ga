import {UsingEnum} from '../../github/ActionRuns';
import {Action} from './../../github/Action';
import {InstallationInputs} from './blocks/installationInputs';

export const DeployAction = new Action({
  name: 'cf-deploy',
  description: 'CF deploy wrapper',
  author: 'Your name or organization here',
  inputs: {
    ...InstallationInputs
  },
  runs: {
    using: UsingEnum.node16,
    main: 'dist/install-cli/index.js'
  }
});

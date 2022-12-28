import {UsingEnum} from '../../action-metadata-schema/ActionRuns';
import {Action} from '../../action-metadata-schema/Action';
import {InstallationInputs} from './blocks/installationInputs';

export const InstallAction = new Action({
  name: 'cf-install-cli',
  description: 'CF deploy wrapper',
  author: 'Your name or organization here',
  inputs: {
    ...InstallationInputs
  },
  runs: {
    using: UsingEnum.node16,
    main: '../../dist/install-cli/index.js'
  }
});

import {UsingEnum} from '../../action-metadata-schema/ActionRuns';
import {Action} from '../../action-metadata-schema/Action';
import {LoginInputs} from './blocks/loginInputs';
import {DMOLInputs} from './blocks/dmolInputs';

export const LoginAction = new Action({
  name: 'cf-dmol',
  description: 'CF dmol wrapper',
  author: 'Your name or organization here',
  inputs: {
    ...LoginInputs,
    ...DMOLInputs
  },
  runs: {
    using: UsingEnum.node16,
    main: '../../dist/login/index.js'
  }
});

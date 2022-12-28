import {UsingEnum} from '../../action-metadata-schema/ActionRuns';
import {Action} from '../../action-metadata-schema/Action';
import {LoginInputs} from './blocks/loginInputs';

export const LoginAction = new Action({
  name: 'cf-login',
  description: 'CF login wrapper',
  author: 'Your name or organization here',
  inputs: {
    ...LoginInputs
  },
  runs: {
    using: UsingEnum.node16,
    main: '../../dist/login/index.js'
  }
});

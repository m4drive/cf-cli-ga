import {UsingEnum} from '../../action-metadata-schema/ActionRuns';
import {Action} from '../../action-metadata-schema/Action';

export const LogoutAction = new Action({
  name: 'cf-logout',
  description: 'CF logout wrapper',
  author: 'Your name or organization here',
  runs: {
    using: UsingEnum.node16,
    main: '../../dist/logout/index.js'
  }
});

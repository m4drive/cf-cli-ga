import {IActionInputs} from '../../../action-metadata-schema/ActionInputs';

export const LoginInputs: IActionInputs = {
  apiUrl: {
    required: false,
    description: ' '
  },
  organization: {
    required: false,
    description: ' '
  },
  space: {
    required: false,
    description: ' '
  },
  user: {
    required: false,
    description: ' '
  },
  password: {
    required: false,
    description: ' '
  },
  credentials: {
    required: false,
    description: ' '
  },
  origin: {
    required: false,
    description: ' '
  },
  manualLogin: {
    required: false,
    description: ' ',
    default: 'false'
  },
  skipSSLValidation: {
    required: false,
    description: ' ',
    default: 'false'
  }
};

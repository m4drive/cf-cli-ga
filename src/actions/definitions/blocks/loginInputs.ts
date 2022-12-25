import {IActionInputs} from '../../../github/ActionInputs';

export const LoginInputs: IActionInputs = {
  apiUrl: {
    required: true,
    description: ' '
  },
  organization: {
    required: true,
    description: ' '
  },
  space: {
    required: true,
    description: ' '
  },
  user: {
    required: true,
    description: ' '
  },
  password: {
    required: true,
    description: ' '
  }
};

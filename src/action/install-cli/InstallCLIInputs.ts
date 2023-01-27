/* eslint-disable filenames/match-regex */
import {InputSchema, SimpleTypes} from '../BaseAction';

export const installCLIInputs: InputSchema[] = [
  {
    inputFieldName: 'cfInstallationPathLinux',
    required: false,
    description: ' ',
    default:
      'https://packages.cloudfoundry.org/stable?release=linux64-binary&version=v8&source=github',
    type: SimpleTypes.string,
    getCommandParameter() {
      return '';
    }
  },
  {
    inputFieldName: 'cfInstallationPathWindows',
    required: false,
    description: ' ',
    default:
      'https://packages.cloudfoundry.org/stable?release=windows64-exe&version=v8&source=github',
    type: SimpleTypes.string,
    getCommandParameter() {
      return '';
    }
  },
  {
    inputFieldName: 'cfInstallationPathMac',
    required: false,
    description: ' ',
    default:
      'https://packages.cloudfoundry.org/stable?release=macosx64-binary&version=v8&source=github',
    type: SimpleTypes.string,
    getCommandParameter() {
      return '';
    }
  },
  {
    inputFieldName: 'plugins',
    required: false,
    description: ' ',
    default: 'multiapps, html5-plugin',
    type: SimpleTypes.string,
    getCommandParameter() {
      return '';
    }
  }
];

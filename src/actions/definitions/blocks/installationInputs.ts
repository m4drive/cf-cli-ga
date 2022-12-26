import {IActionInputs} from '../../../github/ActionInputs';

export const InstallationInputs: IActionInputs = {
  cfInstallationPathLinux: {
    required: false,
    description: ' ',
    default:
      'https://packages.cloudfoundry.org/stable?release=linux64-binary&version=v8&source=github'
  },
  cfInstallationPathWindows: {
    required: false,
    description: ' ',
    default:
      'https://packages.cloudfoundry.org/stable?release=windows64-exe&version=v8&source=github'
  },
  cfInstallationPathMac: {
    required: false,
    description: ' ',
    default:
      'https://packages.cloudfoundry.org/stable?release=macosx64-binary&version=v8&source=github'
  },
  plugins: {
    required: false,
    description: ' ',
    default: 'multiapps, html5-plugin'
  }
};

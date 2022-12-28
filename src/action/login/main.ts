import {LoginAction} from './LoginAction';

/*import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {Utils} from '../utils/Utils';*/
async function run(): Promise<void> {
  await new LoginAction().run();
}
run();
/*async function run(): Promise<void> {
  try {
    const credentials = getLoginCredentials();
    if (!Utils.isCFInstalled()) {
      throw new Error('CF CLI not installed!');
    }
    if (credentials.manualLogin) {
      core.info('Reseived flag manualLogin: skipping login!');
      return;
    }
    const command = await buildLoginCommand(credentials);
    core.info('CF CLI login into account!');
    await exec.exec(command);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
async function buildLoginCommand(credentials: Credentials): Promise<string> {
  const mandatoryFieldList = [
    'apiUrl',
    'organization',
    'space',
    'user',
    'password'
  ];
  const errorMsg = mandatoryFieldList
    .filter(
      field =>
        !Object.getOwnPropertyNames(credentials).includes(field) ||
        typeof credentials[field as keyof typeof credentials] === 'undefined'
    )
    .reduce((previous: string, current: string) => {
      return `Missing mandatory field "${current}" in cf login credentials\r\n`;
    }, '');
  if (errorMsg && errorMsg.length > 0) {
    throw new Error(errorMsg);
  }
  if (credentials.user) core.setSecret(credentials.user);
  if (credentials.password) core.setSecret(credentials.password);
  const cfCliPath = await Utils.getCFBinaryLocation();
  let baseCommand = `${cfCliPath} login -a ${credentials.apiUrl} -u "${credentials.user}" -p "${credentials.password}" -o "${credentials.organization}" -s "${credentials.space}`;
  if (credentials.origin) {
    baseCommand += ` --origin ${credentials.origin}`;
  }
  if (credentials.skipSSLValidation) {
    baseCommand += ` --skip-ssl-validation`;
  }
  return baseCommand;
}
run();

function getLoginCredentials(): Credentials {
  let credentials: Credentials = {};
  const jsonCredentials = core.getInput('credentials');
  if (jsonCredentials) {
    try {
      credentials = JSON.parse(jsonCredentials);
    } catch (e) {
      core.info(String(e));
      throw new Error('Unable to parse login credentials parameter!');
    }
  }
  credentials.apiUrl = core.getInput('apiUrl') || credentials.apiUrl;
  credentials.organization =
    core.getInput('organization') || credentials.organization;
  credentials.space = core.getInput('space') || credentials.space;
  credentials.user = core.getInput('user') || credentials.user;
  credentials.password = core.getInput('password') || credentials.password;
  credentials.origin = core.getInput('apiUrl') || credentials.origin;
  if (core.getInput('manualLogin') === 'true') {
    credentials.manualLogin = true;
  } else if (core.getInput('manualLogin') === 'false') {
    credentials.manualLogin = false;
  } else if (typeof credentials.manualLogin != 'boolean') {
    credentials.manualLogin = false;
  }
  if (core.getInput('skipSSLValidation') === 'true') {
    credentials.skipSSLValidation = true;
  } else if (core.getInput('skipSSLValidation') === 'false') {
    credentials.skipSSLValidation = false;
  } else if (typeof credentials.skipSSLValidation != 'boolean') {
    credentials.skipSSLValidation = false;
  }
  return credentials;
}

interface Credentials {
  apiUrl?: string;
  organization?: string;
  space?: string;
  user?: string;
  password?: string;
  origin?: string;
  manualLogin?: boolean;
  skipSSLValidation?: boolean;
}
*/

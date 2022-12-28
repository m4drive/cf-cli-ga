import {Base} from '../action-metadata-schema/Base';
import fs from 'fs';
import {DeployAction} from './definitions/deploy';
import {InstallAction} from './definitions/install-cli';
import {LogoutAction} from './definitions/logout';
import {LoginAction} from './definitions/login';

const actionsArray = [DeployAction, InstallAction, LoginAction, LogoutAction];
const BASE_LOCATION = './cf';
fs.rmSync(BASE_LOCATION, {recursive: true, force: true});
fs.mkdirSync(BASE_LOCATION);
actionsArray.map((action: Base) => {
  fs.mkdirSync(`${BASE_LOCATION}/${action.getFolderName()}`);
  fs.writeFileSync(
    `${BASE_LOCATION}/${action.getFolderName()}/action.yaml`,
    action.getAsYaml()
  );
});

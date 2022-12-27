import yaml from 'js-yaml';
import {Base} from '../github/Base';
import fs from 'fs';
import {DeployAction} from './definitions/deploy';
import {InstallAction} from './definitions/install-cli';

const actionsArray = [DeployAction, InstallAction];
const BASE_LOCATION = './cf';
/*const SEPARATOR = '\r\n---\r\n\r\n';
const result = actionsArray
  .map((action: Base) => yaml.dump(action.getAsJsonObject()))
  .join(SEPARATOR);
console.log(result);*/
fs.rmSync(BASE_LOCATION, {recursive: true, force: true});
fs.mkdirSync(BASE_LOCATION);
actionsArray.map((action: Base) => {
  fs.mkdirSync(`${BASE_LOCATION}/${action.getFolderName()}`);
  fs.writeFileSync(
    `${BASE_LOCATION}/${action.getFolderName()}/action.yaml`,
    action.getAsYaml()
  );
});

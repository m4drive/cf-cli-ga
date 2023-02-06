import {Base} from '../schema/Base';
import fs from 'fs';
import {DeployAction} from './deploy/DeployAction';
import {InstallCLIAction} from './install-cli/InstallCLIAction';
import {LoginAction} from './login/LoginAction';
import {DMOLAction} from './dmol/DMOLAction';
import {LogoutAction} from './logout/LogoutAction';
import {CommandAction} from './command/CommandAction';

const actionsArray = [
  new DeployAction().getActionMetadata(),
  new InstallCLIAction().getActionMetadata(),
  new LoginAction().getActionMetadata(),
  new LogoutAction().getActionMetadata(),
  new DMOLAction().getActionMetadata(),
  new CommandAction().getActionMetadata()
];
const BASE_LOCATION = './cf';
const DIST_LOCATION = './dist';
const JS_FILE_NAMES = ['index.js', 'index.map.js', 'sourcemap-register.js'];
fs.rmSync(BASE_LOCATION, {recursive: true, force: true});
fs.mkdirSync(BASE_LOCATION);
actionsArray.map((action: Base) => {
  const folderName = action.getFolderName();
  fs.mkdirSync(`${BASE_LOCATION}/${folderName}`);
  fs.writeFileSync(
    `${BASE_LOCATION}/${folderName}/action.yaml`,
    action.getAsYaml()
  );
  for (const fileName of JS_FILE_NAMES) {
    fs.copyFileSync(
      `${DIST_LOCATION}/${folderName}/${fileName}`,
      `${BASE_LOCATION}/${folderName}/${fileName}`
    );
  }
});

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
fs.rmSync(BASE_LOCATION, {recursive: true, force: true});
fs.mkdirSync(BASE_LOCATION);
actionsArray.map((action: Base) => {
  fs.mkdirSync(`${BASE_LOCATION}/${action.getFolderName()}`);
  fs.writeFileSync(
    `${BASE_LOCATION}/${action.getFolderName()}/action.yaml`,
    action.getAsYaml()
  );
});

import {DeployAction} from './DeployAction';

async function run(): Promise<void> {
  await new DeployAction().run();
}
run();

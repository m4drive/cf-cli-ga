import {LoginAction} from './LoginAction';

async function run(): Promise<void> {
  await new LoginAction().run();
}
run();

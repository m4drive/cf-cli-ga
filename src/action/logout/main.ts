import {LogoutAction} from './LogoutAction';

async function run(): Promise<void> {
  await new LogoutAction().run();
}
run();

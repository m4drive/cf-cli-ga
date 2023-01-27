import {InstallCLIAction} from './InstallCLIAction';

async function run(): Promise<void> {
  await new InstallCLIAction().run();
}
run();

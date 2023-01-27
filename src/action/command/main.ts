import {CommandAction} from './CommandAction';

async function run(): Promise<void> {
  await new CommandAction().run();
}
run();

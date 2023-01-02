import {DMOLAction} from './DMOLAction';
async function run(): Promise<void> {
  await new DMOLAction().run();
}
run();

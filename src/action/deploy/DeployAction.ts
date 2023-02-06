/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import {IActionOutputs} from '../../schema/ActionOutputs';
import {IActionRuns, UsingEnum} from '../../schema/ActionRuns';
import {BaseAction, InputSchema} from '../BaseAction';
import {baseInputs} from '../BaseInputs';
import {DMOLAction} from '../dmol/DMOLAction';
import {loginInputs} from '../login/LoginInputs';
import {deployInputs} from './DeployInputs';

export class DeployAction extends BaseAction {
  DELPOYMENT_ID_LENGTH = 36;
  getName(): string {
    return 'cf-deploy';
  }
  getDescription(): string {
    return 'CF deploy wrapper';
  }
  getAuthor(): string {
    return '';
  }
  getRuns(): IActionRuns {
    return {
      using: UsingEnum.node16,
      main: 'index.js',
      pre: '../login/index.js',
      post: '../logout/index.js'
    };
  }
  getOutputs(): IActionOutputs | undefined {
    return {
      deploymentId: {
        description: 'Id of CF mtar deployment.'
      }
    };
  }
  getInputSchema(): InputSchema[] {
    return [
      ...loginInputs.map(input => {
        input.required = false;
        return input;
      }),
      ...deployInputs,
      ...baseInputs
    ];
  }
  getBaseCommand(): string {
    return 'deploy';
  }
  getHideOutput(): boolean {
    return false;
  }
  async run(): Promise<void> {
    //add deploymend id search listener
    this.addListenerOnStdLine((data: string) =>
      this.deploymentIdSearchListener(data)
    );
    const saveDMOLOn = core.getInput('saveDMOLOn');
    try {
      await super.run();
      if (saveDMOLOn === SaveDMOLOnOptions.always) {
        await this.saveDMOLtoArtifactory();
      }
    } catch (e) {
      core.error(String(e));
      if (
        saveDMOLOn === SaveDMOLOnOptions.always ||
        saveDMOLOn === SaveDMOLOnOptions.onFail
      ) {
        await this.saveDMOLtoArtifactory();
      }
      core.setFailed(String(e));
    }
    //TODO: implement save dmol to artifactory
  }

  async saveDMOLtoArtifactory(): Promise<void> {
    const deplotmentId = this.getDeploymentId();
    if (deplotmentId) {
      const dmolAction = new DMOLAction();
      dmolAction.setDeploymentId(deplotmentId);
      await dmolAction.run();
    } else {
      core.error('Missing deploymentId in save dmol phase of deploy action!');
    }
  }
  deploymentIdSearchListener(data: string): void {
    if (!this.getDeploymentId()) {
      const deplotmentId = this.getDeploymentIdFromOutput(data);
      if (deplotmentId.length === this.DELPOYMENT_ID_LENGTH) {
        this.setDeploymentId(deplotmentId);
        core.setOutput('deploymentId', deplotmentId);
      }
    }
  }
  protected deploymentId: string | undefined;
  getDeploymentId(): string | undefined {
    return this.deploymentId;
  }
  setDeploymentId(deploymentId: string): void {
    this.deploymentId = deploymentId;
  }
  getDeploymentIdFromOutput(str: string): string {
    const regex =
      // /Use\s+"cf\s+dmol\s+-i\s+([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})"\s+to\s+download\s+the\s+logs\s+of\s+the\s+process\./;
      /Operation\s+ID:\s+([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})/;
    if (str.match(regex)) {
      const regexResults = regex.exec(str);
      if (regexResults != null && regexResults.length > 1) {
        return regexResults[1];
      }
    }
    return '';
  }
}
enum SaveDMOLOnOptions {
  always = 'ALWAYS',
  onFail = 'ON_FAIL'
}

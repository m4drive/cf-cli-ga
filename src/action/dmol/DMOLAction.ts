/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import * as artifact from '@actions/artifact';
import {BaseAction, InputSchema, SimpleTypes} from '../BaseAction';
import {dmolInputs} from './DMOLInputs';
import * as fs from 'fs';

export class DMOLAction extends BaseAction {
  getInputSchema(): InputSchema[] {
    return [
      ...dmolInputs,
      {
        inputFieldName: 'manualLogin',
        type: SimpleTypes.boolean,
        getCommandParameter() {
          return '';
        }
      },
      {
        inputFieldName: 'apiUrl',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-a ${value}`;
        },
        mandatory: true
      },
      {
        inputFieldName: 'organization',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-o ${value}`;
        },
        mandatory: true
      },
      {
        inputFieldName: 'space',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-s ${value}`;
        },
        mandatory: true
      },
      {
        inputFieldName: 'user',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-u ${value}`;
        },
        mandatory: true,
        isSecret: true
      },
      {
        inputFieldName: 'password',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-p ${value}`;
        },
        mandatory: true,
        isSecret: true
      },
      {
        inputFieldName: 'skipSSLValidation',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? '--skip-ssl-validation' : '';
        }
      },
      {
        inputFieldName: 'origin',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `--origin ${value}`;
        }
      },
      {
        inputFieldName: 'credentials',
        type: SimpleTypes.string,
        getCommandParameter() {
          return '';
        },
        isJsonParameters: true
      }
    ];
  }
  getBaseCommand(): string {
    return 'dmol';
  }
  getHideOutput(): boolean {
    return false;
  }
  protected deploymentId: string | undefined;
  getDeploymentId(): string | undefined {
    return this.deploymentId;
  }
  setDeploymentId(deploymentId: string): void {
    this.deploymentId = deploymentId;
  }
  async run(): Promise<void> {
    const deploymentId =
      core.getInput('deploymentId') || this.getDeploymentId();
    const mtaId = core.getInput('mtaId');
    const saveDMOLToArtifactory = core.getInput('saveDMOLToArtifactory');
    if (deploymentId && mtaId) {
      throw new Error(
        `Provided deploymentId and mtaId! Expected one of them for DMOL!`
      );
    }
    if (deploymentId || mtaId) {
      throw new Error(`Neither deploymentId nor mtaId provided for DMOL!`);
    }
    await super.run();
    if (saveDMOLToArtifactory === 'true') {
      this.saveDMOLtoArtifactory();
    }
  }
  async saveDMOLtoArtifactory(): Promise<void> {
    const baseFolder = core.getInput('directory') || './';
    const deploymentId = core.getInput('deploymentId');
    const mtaId = core.getInput('mtaId');
    const dmolArtifactName = core.getInput('dmolArtifactName') || 'dmol output';
    let mtaopDir: string;
    if (deploymentId) {
      mtaopDir = `${baseFolder}/mta-op-${deploymentId}`;
    } else if (mtaId) {
      //TODO: implement realization
      throw new Error(`Not implemented yet dmol using mtaId!`);
    } else {
      throw new Error(`Neither deploymentId nor mtaId provided for DMOL!`);
    }
    const files: string[] = fs
      .readdirSync(mtaopDir)
      .map(file => `${mtaopDir}/${file}`);
    await artifact.create().uploadArtifact(dmolArtifactName, files, baseFolder);
  }
}

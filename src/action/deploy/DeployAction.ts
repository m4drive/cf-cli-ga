/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import {BaseAction, InputSchema, SimpleTypes} from '../BaseAction';
import {DMOLAction} from '../dmol/DMOLAction';
import {loginInputs} from '../login/LoginInputs';

export class DeployAction extends BaseAction {
  DELPOYMENT_ID_LENGTH = 36;
  getInputSchema(): InputSchema[] {
    return [
      ...loginInputs.map(input => {
        input.mandatory = false;
        return input;
      }),
      {
        inputFieldName: 'mtaFile',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `${value}`;
        },
        mandatory: true
      },
      {
        inputFieldName: 'modules',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-m ${value}`;
        }
      },
      {
        inputFieldName: 'resources',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-r ${value}`;
        }
      },
      {
        inputFieldName: 'operationId',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-i ${value}`;
        }
      },
      {
        inputFieldName: 'action',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-a ${value}`;
        }
      },
      {
        inputFieldName: 'extDescriptor',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-e ${value}`;
        }
      },
      {
        inputFieldName: 'timeout',
        type: SimpleTypes.number,
        getCommandParameter(value) {
          return `-t ${value}`;
        }
      },
      {
        inputFieldName: 'versionRule',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `--version-rule ${value}`;
        }
      },
      {
        inputFieldName: 'deployServiceUrl',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `-u ${value}`;
        }
      },
      {
        inputFieldName: 'force',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `-f` : ``;
        }
      },
      {
        inputFieldName: 'retries',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `--retries ${value}`;
        }
      },
      {
        inputFieldName: 'noStart',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--no-start` : ``;
        }
      },
      {
        inputFieldName: 'namespace',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `--namespace ${value}`;
        }
      },
      {
        inputFieldName: 'deleteService',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--delete-service` : ``;
        }
      },
      {
        inputFieldName: 'deleteServiceKeys',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--delete-service-keys` : ``;
        }
      },
      {
        inputFieldName: 'deleteServiceBrokers',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--delete-service-brokers` : ``;
        }
      },
      {
        inputFieldName: 'keepFiles',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--keep-files` : ``;
        }
      },
      {
        inputFieldName: 'noRestartSubscribedApps',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--no-restart-subscribed-apps` : ``;
        }
      },
      {
        inputFieldName: 'doNotFailOnMissingPermissions',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--do-not-fail-on-missing-permissions` : ``;
        }
      },
      {
        inputFieldName: 'abortOnError',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--abort-on-error` : ``;
        }
      },
      {
        inputFieldName: 'verifyArchiveSignature',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--verify-archive-signature` : ``;
        }
      },
      {
        inputFieldName: 'strategy',
        type: SimpleTypes.string,
        getCommandParameter(value) {
          return `--strategy ${value}`;
        }
      },
      {
        inputFieldName: 'skipTestingPhase',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--skip-testing-phase` : ``;
        }
      },
      {
        inputFieldName: 'skipIdleStart',
        type: SimpleTypes.boolean,
        getCommandParameter(value) {
          return value ? `--skip-idle-start` : ``;
        }
      },
      {
        inputFieldName: 'saveDMOLOn',
        type: SimpleTypes.string,
        getCommandParameter() {
          return '';
        }
      }
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
      /Use\s+"cf\s+dmol\s+-i\s+([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})"\s+to\s+download\s+the\s+logs\s+of\s+the\s+process\./;
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

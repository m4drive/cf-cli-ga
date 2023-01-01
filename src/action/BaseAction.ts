/* eslint-disable filenames/match-regex */
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {Utils} from './utils/Utils';

export class BaseAction {
  protected inputs: InputSchema[] = [];
  getInputSchema(): InputSchema[] {
    throw new Error('Not implemented!');
  }
  getBaseCommand(): string {
    throw new Error('Not implemented!');
  }
  getHideOutput(): boolean {
    throw new Error('Not implemented!');
  }
  async getInput(): Promise<InputSchema[]> {
    const inputs = this.getInputSchema();
    const plainInputs = inputs.filter(input => !input.isJsonParameters);
    const jsonInputs = inputs.filter(input => input.isJsonParameters);
    for (const input of jsonInputs) {
      const value = core.getInput(input.inputFieldName);
      let parsedInput;
      try {
        parsedInput = JSON.parse(value);
      } catch (e) {
        throw new Error(
          `Failed to parse json parameter: ${input.inputFieldName}`
        );
      }
      for (const field of Object.getOwnPropertyNames(parsedInput)) {
        const plainInput = plainInputs.find(
          inp => inp.inputFieldName === field
        );
        if (typeof plainInput != 'undefined') {
          try {
            plainInput.value = this.castType(
              parsedInput[field],
              plainInput.type
            );
          } catch (e) {
            throw new Error(
              `Failed to cast type of input parameter "${input.inputFieldName}" with value "${value}" to "${input.type}" type!`
            );
          }
        } else {
          throw new Error(
            `Unknown input parameter "${field}" met in "${input.inputFieldName}" input.`
          );
        }
      }
    }
    for (const input of plainInputs) {
      const value = core.getInput(input.inputFieldName);
      if (typeof input.mandatory === 'undefined') input.mandatory = false;
      if (typeof input.isSecret === 'undefined') input.isSecret = false;

      if (
        (typeof value === 'undefined' || value.length === 0) &&
        typeof input.value === 'undefined'
      ) {
        input.isEmpty = true;
      } else {
        input.isEmpty = false;
        if (typeof value != 'undefined' && value.length !== 0) {
          try {
            input.value = this.castType(value, input.type);
          } catch (e) {
            throw new Error(
              `Failed to cast type of input parameter "${input.inputFieldName}" with value "${value}" to "${input.type}" type!`
            );
          }
        }
      }
    }
    let errorMessage = '';
    for (const input of plainInputs.filter(
      inp => inp.mandatory && inp.isEmpty
    )) {
      errorMessage += `Missing value for mandatory input parameter: ${input.inputFieldName}\r\n`;
    }
    if (errorMessage.length > 0) {
      throw new Error(errorMessage);
    }
    this.inputs = plainInputs;
    return plainInputs;
  }
  async buildCommand(inputs: InputSchema[]): Promise<string> {
    if (!(await Utils.isCFInstalled())) {
      throw new Error('CF CLI not installed!');
    }
    let command = `${await Utils.getCFBinaryLocation()} ${this.getBaseCommand()} `;
    command += inputs
      .filter(input => !input.isEmpty)
      .map(input =>
        typeof input.value != 'undefined'
          ? input.getCommandParameter(input.value)
          : ''
      )
      .join(' ');
    return command;
  }
  castType(value: string, type: SimpleTypes): string | number | boolean {
    switch (type) {
      case SimpleTypes.string:
        return value;
      case SimpleTypes.boolean:
        return value.trim().toLowerCase() === 'true';
      case SimpleTypes.number:
        return Number(value.trim());
    }
  }
  hideSecrets(inputs: InputSchema[]): void {
    for (const input of inputs.filter(inp => inp.isSecret)) {
      core.setSecret(String(input.value));
    }
  }
  protected stdOutListeners: ((data: Buffer) => void)[] = [];
  protected stdErrListeners: ((data: Buffer) => void)[] = [];
  protected stdLineListeners: ((data: string) => void)[] = [];
  protected errLineListeners: ((data: string) => void)[] = [];
  protected debugListeners: ((data: string) => void)[] = [];
  protected endListeners: Function[] = [];

  addListenerOnStdOut(listener: (data: Buffer) => void): void {
    this.stdOutListeners.push(listener);
  }
  addListenerOnStdErr(listener: (data: Buffer) => void): void {
    this.stdErrListeners.push(listener);
  }
  addListenerOnStdLine(listener: (data: string) => void): void {
    this.stdLineListeners.push(listener);
  }
  addListenerOnErrLine(listener: (data: string) => void): void {
    this.errLineListeners.push(listener);
  }
  addListenerOnDebug(listener: (data: string) => void): void {
    this.debugListeners.push(listener);
  }
  addListenerOnEnd(listener: Function): void {
    this.endListeners.push(listener);
  }
  async exec(
    command: string,
    parameters: string[] = [],
    options: exec.ExecOptions = {}
  ): Promise<number> {
    if (this.getHideOutput()) {
      options.silent = true;
    }
    if (!options.listeners) {
      options.listeners = {};
    }
    if (options.listeners.debug)
      this.addListenerOnDebug(options.listeners.debug);
    if (options.listeners.errline)
      this.addListenerOnErrLine(options.listeners.errline);
    if (options.listeners.stderr)
      this.addListenerOnStdErr(options.listeners.stderr);
    if (options.listeners.stdline)
      this.addListenerOnStdLine(options.listeners.stdline);
    if (options.listeners.stdout)
      this.addListenerOnStdOut(options.listeners.stdout);

    if (this.debugListeners.length > 0) {
      options.listeners.debug = (data: string) => {
        for (const listener of this.debugListeners) {
          listener(data);
        }
      };
    }
    if (this.errLineListeners.length > 0) {
      options.listeners.errline = (data: string) => {
        for (const listener of this.errLineListeners) {
          listener(data);
        }
      };
    }
    if (this.stdErrListeners.length > 0) {
      options.listeners.stderr = (data: Buffer) => {
        for (const listener of this.stdErrListeners) {
          listener(data);
        }
      };
    }
    if (this.stdLineListeners.length > 0) {
      options.listeners.stdline = (data: string) => {
        for (const listener of this.stdLineListeners) {
          listener(data);
        }
      };
    }
    if (this.stdOutListeners.length > 0) {
      options.listeners.stdout = (data: Buffer) => {
        for (const listener of this.stdOutListeners) {
          listener(data);
        }
      };
    }

    const result = await exec.exec(command, parameters, options);
    for (const listener of this.endListeners) {
      listener();
    }
    return result;
  }

  async run(): Promise<void> {
    try {
      await this.getInput();
      this.hideSecrets(this.inputs);
      const command = await this.buildCommand(this.inputs);
      await this.exec(command);
    } catch (exception) {
      core.setFailed(String(exception));
    }
  }
}
export interface InputSchema {
  inputFieldName: string;
  mandatory?: boolean;
  getCommandParameter(value: string | number | boolean): string;
  value?: string | number | boolean;
  isEmpty?: boolean;
  type: SimpleTypes;
  isSecret?: boolean;
  isJsonParameters?: boolean;
}

export enum SimpleTypes {
  string = 'string',
  boolean = 'boolean',
  number = 'number'
}

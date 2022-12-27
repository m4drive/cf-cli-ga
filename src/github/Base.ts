/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable filenames/match-regex */

import Joi from 'joi';
import yaml from 'js-yaml';

export class Base {
  data: JsonObject;
  constructor(data: any) {
    this.validate(data);
    this.data = data;
  }
  validate(data: any): void {
    const validationResult = this.getSchema().validate(data);
    if (validationResult.error) {
      throw new Error(`${validationResult.error}`);
    }
  }
  static getClassSchema(): Joi.ObjectSchema {
    throw new Error('Requires implemetation');
  }
  getSchema(): Joi.ObjectSchema {
    throw new Error('Requires implemetation');
  }
  static fromYamlFieldNameToJS(fieldName: string): string {
    return fieldName.replace(/-([a-z])/g, x =>
      String(x).replace('-', '').toUpperCase()
    );
  }
  static fromJSFieldNameToYaml(fieldName: string): string {
    return fieldName.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
  getAsJsonObject(): any {
    const result: JsonObject = {};
    for (const [key] of Object.entries(this.getSchema().describe().keys)) {
      if (typeof this.data[key] != 'undefined') {
        if (Array.isArray(this.data[key])) {
          result[Base.fromJSFieldNameToYaml(key)] = this.data[key].map(
            (value: any) =>
              value instanceof Base ? value.getAsJsonObject() : value
          );
        } else {
          result[Base.fromJSFieldNameToYaml(key)] =
            this.data[key] instanceof Base
              ? this.data[key].getAsJsonObject()
              : this.data[key];
        }
      }
    }
    return result;
  }
  getAsYaml(): string {
    return yaml.dump(this.getAsJsonObject());
  }
  getFolderName(): string {
    if (this.data && this.data.runs && this.data.runs.main) {
      const regex = /\/([a-z\-\d]+)\/index\.js/;
      if (regex.test(this.data.runs.main)) {
        return this.data.runs.main.match(regex)[1];
      } else {
        throw new Error('Unsupported runs.main location!');
      }
    }
    throw new Error('Missing runs.main parameter!');
  }
}

interface JsonObject {
  [key: string]: any;
}

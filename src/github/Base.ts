/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable filenames/match-regex */

import Joi from 'joi';

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
}

interface JsonObject {
  [key: string]: any;
}

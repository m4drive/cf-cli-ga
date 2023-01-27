/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable filenames/match-regex */
import Joi from 'joi';
import {Base} from './Base';

export class ActionOutputs extends Base {
  constructor(data: ActionOutputs) {
    super(data);
  }
  static getClassSchema(): Joi.ObjectSchema {
    return Joi.object({}).pattern(/^/, ActionOutput.getClassSchema());
  }
  getSchema(): Joi.ObjectSchema {
    return ActionOutputs.getClassSchema();
  }
}
export class ActionOutput extends Base {
  static getClassSchema(): Joi.ObjectSchema {
    return Joi.object({
      description: Joi.string().required(),
      deprecationMessage: Joi.string(),
      required: Joi.boolean(),
      default: Joi.string()
    });
  }
  getSchema(): Joi.ObjectSchema {
    return ActionOutput.getClassSchema();
  }
}
export interface IActionOutput {
  description: string;
}
export interface IActionOutputs {
  [key: string]: IActionOutput;
}

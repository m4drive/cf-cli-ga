/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable filenames/match-regex */
import Joi from 'joi';
import {Base} from './Base';

export class ActionInputs extends Base {
  constructor(data: IActionInputs) {
    super(data);
  }
  static getClassSchema(): Joi.ObjectSchema {
    return Joi.object({}).pattern(/^/, ActionInput.getClassSchema());
  }
  getSchema(): Joi.ObjectSchema {
    return ActionInputs.getClassSchema();
  }
}
export class ActionInput extends Base {
  static getClassSchema(): Joi.ObjectSchema {
    return Joi.object({
      description: Joi.string().required(),
      deprecationMessage: Joi.string(),
      required: Joi.boolean(),
      default: Joi.string()
    });
  }
  getSchema(): Joi.ObjectSchema {
    return ActionInput.getClassSchema();
  }
}
export interface IActionInput {
  description: string;
  deprecationMessage?: string;
  required?: boolean;
  default?: string;
}
export interface IActionInputs {
  [key: string]: IActionInput;
}

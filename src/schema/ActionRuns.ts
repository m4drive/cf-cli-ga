/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable filenames/match-regex */

import Joi from 'joi';
import {Base} from './Base';
export class ActionRuns extends Base {
  constructor(data: IActionRuns) {
    super(data);
  }
  static getClassSchema(): Joi.ObjectSchema {
    return Joi.object({
      using: Joi.string().required().valid(UsingEnum.node12, UsingEnum.node16),
      main: Joi.string().required(),
      pre: Joi.string(),
      preIf: Joi.string(),
      post: Joi.string(),
      postIf: Joi.string()
    });
  }
  getSchema(): Joi.ObjectSchema {
    return ActionRuns.getClassSchema();
  }
}

export enum UsingEnum {
  node12 = 'node12',
  node16 = 'node16'
}
export interface IActionRuns {
  using: UsingEnum;
  main: string;
  pre?: string;
  preIf?: string;
  post?: string;
  postIf?: string;
}

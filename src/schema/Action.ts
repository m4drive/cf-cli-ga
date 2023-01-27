/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable filenames/match-regex */

import Joi from 'joi';
import {Base} from './Base';
import {ActionInputs, IActionInputs} from './ActionInputs';
import {ActionOutputs, IActionOutputs} from './ActionOutputs';
import {ActionRuns, IActionRuns} from './ActionRuns';
export class Action extends Base {
  constructor(data: IAction) {
    super(data);
  }
  static getClassSchema(): Joi.ObjectSchema {
    return Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      author: Joi.string(),
      inputs: ActionInputs.getClassSchema(),
      outputs: ActionOutputs.getClassSchema(),
      runs: ActionRuns.getClassSchema()
    });
  }
  getSchema(): Joi.ObjectSchema {
    return Action.getClassSchema();
  }
}
export interface IAction {
  name: string;
  description: string;
  runs: IActionRuns;
  author?: string;
  inputs?: IActionInputs;
  outputs?: IActionOutputs;
}

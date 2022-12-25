/* eslint-disable no-console */
import yaml from 'js-yaml';
import {Base} from '../github/Base';
import {DeployAction} from './definitions/deploy';

const actionsArray = [DeployAction];
const SEPARATOR = '\r\n---\r\n\r\n';
const result = actionsArray
  .map((action: Base) => yaml.dump(action.getAsJsonObject()))
  .join(SEPARATOR);
console.log(result);

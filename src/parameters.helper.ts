import { generateIdName } from './id.helper';

function getParametersAsStringFromConstructor(constructor: NewableFunction): string {
  const parameters = constructor.toString().match(/(constructor|function) ?(.*) ?\((.*)\)/);

  if (!parameters) {
    throw new Error(`Cannot find constructor in this class ${constructor.name}`);
  }

  return parameters[3];
}

function convertStringParametersToList(stringParameters: string): string[] {
  return stringParameters
    .split(',')
    .map((arg) => arg.replace(/\/\*.*\*\//, '').trim())
    .filter(Boolean);
}

export function getParametersFromConstructor(constructor: NewableFunction): string[] {
  return convertStringParametersToList(getParametersAsStringFromConstructor(constructor));
}

export function cleanParameter(parameter: string): string {
  return generateIdName(parameter).replace(/_/g, '');
}

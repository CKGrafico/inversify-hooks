import { ServiceIdentifier } from 'inversify';
import { getContainer } from './container';
import { Identifier } from './id.helper';

export function useInject<T>(id: Identifier): [T] {
  return [getContainer().get<T>(id as ServiceIdentifier<T>)];
}

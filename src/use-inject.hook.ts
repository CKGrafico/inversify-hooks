import { getContainer, Id } from 'inversify-props';

export function useInject<T>(id: Id): [T] {
  return [getContainer().get<T>(id)];
}

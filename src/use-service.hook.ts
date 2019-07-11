import { container } from 'inversify-props';

export function useContainer<T>(id: string | symbol): T {
  return container.get(id);
}

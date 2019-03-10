import { container } from 'inversify-props';

export function useService<T>(id: string): T {
  return container.get(id);
}

import { cid, container, Container, Inject, inject, injectable } from 'inversify-props';

function useInject<T>(id: string | symbol): [T] {
  return [container.get<T>(id)]
}

export { useInject, container, Inject, inject, injectable, Container, cid };


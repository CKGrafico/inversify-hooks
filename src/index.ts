import { cid, container, Container, Inject, inject, injectable, mockInject, mockRequest, mockSingleton, mockTransient, resetContainer } from 'inversify-props';

function useInject<T>(id: string | symbol): [T] {
  return [container.get<T>(id)]
}

export { useInject, container, Inject, inject, injectable, Container, cid, mockInject, resetContainer, mockRequest, mockSingleton, mockTransient };


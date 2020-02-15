import {
  cid,
  Container,
  getContainer,
  Inject,
  inject,
  injectable,
  mockRequest,
  mockSingleton,
  mockTransient,
  resetContainer,
  setContainer
} from 'inversify-props';

function useInject<T>(id: string | symbol): [T] {
  return [getContainer().get<T>(id)];
}

export {
  useInject,
  Inject,
  inject,
  injectable,
  Container,
  cid,
  resetContainer,
  mockRequest,
  mockSingleton,
  mockTransient,
  setContainer,
  getContainer
};

import { cid, container, Container, Inject, inject, injectable, mockInject, mockRequest, mockSingleton, mockTransient, resetContainer } from 'inversify-props';
declare function useInject<T>(id: string | symbol): [T];
export { useInject, container, Inject, inject, injectable, Container, cid, mockInject, resetContainer, mockRequest, mockSingleton, mockTransient };

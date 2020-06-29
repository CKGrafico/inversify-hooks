import { cid, Container, container, getContainer, Inject, inject, injectable, mockRequest, mockSingleton, mockTransient, resetContainer, setContainer } from 'inversify-props';
declare function useInject<T>(id: string | symbol): [T];
export { useInject, Inject, inject, injectable, Container, cid, resetContainer, mockRequest, mockSingleton, mockTransient, container, setContainer, getContainer };

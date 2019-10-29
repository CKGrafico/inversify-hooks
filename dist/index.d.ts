import { cid, container, Container, Inject, inject, injectable } from 'inversify-props';
declare function useInject<T>(id: string | symbol): [T];
export { useInject, container, Inject, inject, injectable, Container, cid };

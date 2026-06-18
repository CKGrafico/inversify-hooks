import { setContainer } from './container';
import { idsCache } from './id.helper';

// Create the default container instance eagerly, so consumers can register
// dependencies right after importing without any setup step.
const container = setContainer();

// Public cache of generated ids, e.g. `cid.IUserService`.
const cid = idsCache;

export { container, cid };
export { Container, getContainer, setContainer, resetContainer } from './container';
export { inject, Inject, injectable } from './inject.helper';
export { mockRequest, mockSingleton, mockTransient } from './mocks.helper';
export { useInject } from './use-inject.hook';
export type { Identifier, IdsCache } from './id.helper';

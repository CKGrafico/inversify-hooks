import * as inversify from 'inversify';
import { ServiceIdentifier, Container as Container$1, Newable, ContainerOptions } from 'inversify';

type Identifier = ServiceIdentifier;
interface IdsCache {
    [key: string]: Identifier;
}

/**
 * Wrapper around the InversifyJS container that adds the ergonomic
 * `addSingleton` / `addTransient` / `addRequest` helpers and auto-generates
 * ids from class names.
 */
declare class Container extends Container$1 {
    bindTo<T>(constructor: Newable<T>, customId?: Identifier): inversify.BindInWhenOnFluentSyntax<T>;
    addTransient<T>(constructor: Newable<T>, customId?: Identifier): inversify.BindWhenOnFluentSyntax<T>;
    addSingleton<T>(constructor: Newable<T>, customId?: Identifier): inversify.BindWhenOnFluentSyntax<T>;
    addRequest<T>(constructor: Newable<T>, customId?: Identifier): inversify.BindWhenOnFluentSyntax<T>;
}
declare function getContainer(): Container;
declare function setContainer(options?: ContainerOptions): Container;
declare function resetContainer(): void;

declare function injectable(): ClassDecorator;
/**
 * Decorator for injecting a dependency into a service. When no id is given it
 * is inferred from the property name (for property injection) or the
 * constructor parameter name (for constructor injection):
 *
 *   `@inject() private userService!: IUserService;` -> id `UserService`
 */
declare function inject(customId?: Identifier): (target: object, propertyKey: string | symbol | undefined, indexOrDescriptor?: number | PropertyDescriptor) => void;
declare const Inject: typeof inject;

declare function mockSingleton<T>(id: Identifier, to: Newable<T>): void;
declare function mockTransient<T>(id: Identifier, to: Newable<T>): void;
declare function mockRequest<T>(id: Identifier, to: Newable<T>): void;

declare function useInject<T>(id: Identifier): [T];

declare const container: Container;
declare const cid: IdsCache;

export { Container, type Identifier, type IdsCache, Inject, cid, container, getContainer, inject, injectable, mockRequest, mockSingleton, mockTransient, resetContainer, setContainer, useInject };

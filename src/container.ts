import {
  Container as InversifyContainer,
  ContainerOptions,
  decorate,
  injectable as inversifyInjectable,
  Newable,
  ServiceIdentifier
} from 'inversify';
import { generateIdAndAddToCache, Identifier } from './id.helper';

const decorated = new WeakSet<object>();

/**
 * Applies `@injectable()` to a class at most once. Registering a class that the
 * user already decorated would otherwise throw, so failures are swallowed.
 */
function ensureInjectable(constructor: Newable): void {
  if (decorated.has(constructor)) {
    return;
  }

  try {
    decorate(inversifyInjectable() as ClassDecorator, constructor);
  } catch {
    // Already injectable — nothing to do.
  }

  decorated.add(constructor);
}

/**
 * Wrapper around the InversifyJS container that adds the ergonomic
 * `addSingleton` / `addTransient` / `addRequest` helpers and auto-generates
 * ids from class names.
 */
export class Container extends InversifyContainer {
  bindTo<T>(constructor: Newable<T>, customId?: Identifier) {
    const id = generateIdAndAddToCache(constructor.name, customId) as ServiceIdentifier<T>;
    ensureInjectable(constructor);
    return this.bind<T>(id).to(constructor);
  }

  addTransient<T>(constructor: Newable<T>, customId?: Identifier) {
    const id = generateIdAndAddToCache(constructor.name, customId) as ServiceIdentifier<T>;
    ensureInjectable(constructor);
    return this.bind<T>(id).to(constructor).inTransientScope();
  }

  addSingleton<T>(constructor: Newable<T>, customId?: Identifier) {
    const id = generateIdAndAddToCache(constructor.name, customId) as ServiceIdentifier<T>;
    ensureInjectable(constructor);
    return this.bind<T>(id).to(constructor).inSingletonScope();
  }

  addRequest<T>(constructor: Newable<T>, customId?: Identifier) {
    const id = generateIdAndAddToCache(constructor.name, customId) as ServiceIdentifier<T>;
    ensureInjectable(constructor);
    return this.bind<T>(id).to(constructor).inRequestScope();
  }
}

let container: Container;

export function getContainer(): Container {
  return container;
}

export function setContainer(options?: ContainerOptions): Container {
  return (container = new Container(options));
}

export function resetContainer(): void {
  getContainer().unbindAll();
}

import { inject as inversifyInject, injectable as inversifyInjectable } from 'inversify';
import { getContainer } from './container';
import { generateIdName, getOrSetIdFromCache, Identifier } from './id.helper';
import { cleanParameter, getParametersFromConstructor } from './parameters.helper';

export function injectable(): ClassDecorator {
  return (constructor) => inversifyInjectable()(constructor);
}

/**
 * Decorator for injecting a dependency into a service. When no id is given it
 * is inferred from the property name (for property injection) or the
 * constructor parameter name (for constructor injection):
 *
 *   `@inject() private userService!: IUserService;` -> id `UserService`
 */
export function inject(customId?: Identifier) {
  return (
    target: object,
    propertyKey: string | symbol | undefined,
    indexOrDescriptor?: number | PropertyDescriptor
  ): void => {
    if (typeof indexOrDescriptor === 'number') {
      injectParameterDecorator(target, propertyKey, indexOrDescriptor, customId);
      return;
    }

    injectPropertyDecorator(target, propertyKey as string | symbol, customId);
  };
}

export const Inject = inject;

function injectParameterDecorator(
  target: object,
  propertyKey: string | symbol | undefined,
  index: number,
  customId?: Identifier
): void {
  let id = customId;

  if (!id) {
    const parameters = getParametersFromConstructor(target as NewableFunction);
    id = getOrSetIdFromCache(generateIdName(cleanParameter(parameters[index])));
  }

  inversifyInject(id)(target, propertyKey, index);
}

function injectPropertyDecorator(target: object, propertyKey: string | symbol, customId?: Identifier): void {
  let id = customId;

  if (!id) {
    id = getOrSetIdFromCache(generateIdName(cleanParameter(propertyKey.toString())));
  }

  const resolvedId = id;

  // Resolve lazily from the current container on access. This keeps injection
  // working even after the container is reconfigured (e.g. mocked in tests).
  Reflect.deleteProperty(target, propertyKey);
  Reflect.defineProperty(target, propertyKey, {
    configurable: true,
    enumerable: true,
    get() {
      return getContainer().get(resolvedId);
    },
    set() {
      // Ignore writes — the value always comes from the container.
    }
  });
}

'use strict';

var inversify = require('inversify');

// src/container.ts

// src/id.helper.ts
var idsCache = {};
function generateIdFromName(name, id) {
  return id ?? Symbol(name);
}
function generateIdName(constructorName) {
  return constructorName.charAt(0).toUpperCase() + constructorName.slice(1);
}
function generateIdOfDependency(name, id) {
  return generateIdFromName(name, id);
}
function generateIdNameOfDependency(name, id) {
  return id ? id.toString() : generateIdName(name);
}
function addIdToCache(id, name) {
  const existingId = idsCache[name];
  if (existingId) {
    return existingId;
  }
  idsCache[`I${name}`] = id;
  return idsCache[name] = id;
}
function generateIdAndAddToCache(constructorName, id) {
  const dependencyId = generateIdOfDependency(constructorName, id);
  const dependencyIdName = generateIdNameOfDependency(constructorName, id);
  return addIdToCache(dependencyId, dependencyIdName);
}
function getOrSetIdFromCache(dependencyIdName, id) {
  const cachedId = idsCache[dependencyIdName];
  if (cachedId) {
    return cachedId;
  }
  return addIdToCache(generateIdFromName(dependencyIdName, id), dependencyIdName);
}

// src/container.ts
var decorated = /* @__PURE__ */ new WeakSet();
function ensureInjectable(constructor) {
  if (decorated.has(constructor)) {
    return;
  }
  try {
    inversify.decorate(inversify.injectable(), constructor);
  } catch {
  }
  decorated.add(constructor);
}
var Container = class extends inversify.Container {
  bindTo(constructor, customId) {
    const id = generateIdAndAddToCache(constructor.name, customId);
    ensureInjectable(constructor);
    return this.bind(id).to(constructor);
  }
  addTransient(constructor, customId) {
    const id = generateIdAndAddToCache(constructor.name, customId);
    ensureInjectable(constructor);
    return this.bind(id).to(constructor).inTransientScope();
  }
  addSingleton(constructor, customId) {
    const id = generateIdAndAddToCache(constructor.name, customId);
    ensureInjectable(constructor);
    return this.bind(id).to(constructor).inSingletonScope();
  }
  addRequest(constructor, customId) {
    const id = generateIdAndAddToCache(constructor.name, customId);
    ensureInjectable(constructor);
    return this.bind(id).to(constructor).inRequestScope();
  }
};
var container;
function getContainer() {
  return container;
}
function setContainer(options) {
  return container = new Container(options);
}
function resetContainer() {
  getContainer().unbindAll();
}

// src/parameters.helper.ts
function getParametersAsStringFromConstructor(constructor) {
  const parameters = constructor.toString().match(/(constructor|function) ?(.*) ?\((.*)\)/);
  if (!parameters) {
    throw new Error(`Cannot find constructor in this class ${constructor.name}`);
  }
  return parameters[3];
}
function convertStringParametersToList(stringParameters) {
  return stringParameters.split(",").map((arg) => arg.replace(/\/\*.*\*\//, "").trim()).filter(Boolean);
}
function getParametersFromConstructor(constructor) {
  return convertStringParametersToList(getParametersAsStringFromConstructor(constructor));
}
function cleanParameter(parameter) {
  return generateIdName(parameter).replace(/_/g, "");
}

// src/inject.helper.ts
function injectable() {
  return (constructor) => inversify.injectable()(constructor);
}
function inject(customId) {
  return (target, propertyKey, indexOrDescriptor) => {
    if (typeof indexOrDescriptor === "number") {
      injectParameterDecorator(target, propertyKey, indexOrDescriptor, customId);
      return;
    }
    injectPropertyDecorator(target, propertyKey, customId);
  };
}
var Inject = inject;
function injectParameterDecorator(target, propertyKey, index, customId) {
  let id = customId;
  if (!id) {
    const parameters = getParametersFromConstructor(target);
    id = getOrSetIdFromCache(generateIdName(cleanParameter(parameters[index])));
  }
  inversify.inject(id)(target, propertyKey, index);
}
function injectPropertyDecorator(target, propertyKey, customId) {
  let id = customId;
  if (!id) {
    id = getOrSetIdFromCache(generateIdName(cleanParameter(propertyKey.toString())));
  }
  const resolvedId = id;
  Reflect.deleteProperty(target, propertyKey);
  Reflect.defineProperty(target, propertyKey, {
    configurable: true,
    enumerable: true,
    get() {
      return getContainer().get(resolvedId);
    },
    set() {
    }
  });
}

// src/mocks.helper.ts
function mockSingleton(id, to) {
  getContainer().unbind(id);
  getContainer().addSingleton(to, id);
}
function mockTransient(id, to) {
  getContainer().unbind(id);
  getContainer().addTransient(to, id);
}
function mockRequest(id, to) {
  getContainer().unbind(id);
  getContainer().addRequest(to, id);
}

// src/use-inject.hook.ts
function useInject(id) {
  return [getContainer().get(id)];
}

// src/index.ts
var container2 = setContainer();
var cid = idsCache;

exports.Container = Container;
exports.Inject = Inject;
exports.cid = cid;
exports.container = container2;
exports.getContainer = getContainer;
exports.inject = inject;
exports.injectable = injectable;
exports.mockRequest = mockRequest;
exports.mockSingleton = mockSingleton;
exports.mockTransient = mockTransient;
exports.resetContainer = resetContainer;
exports.setContainer = setContainer;
exports.useInject = useInject;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map
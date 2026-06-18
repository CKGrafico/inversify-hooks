import { ServiceIdentifier } from 'inversify';

export type Identifier = ServiceIdentifier;

export interface IdsCache {
  [key: string]: Identifier;
}

/**
 * Cache of generated ids, keyed by both the class name (`Service`) and its
 * interface-style alias (`IService`). Exposed publicly as `cid`. The object
 * reference is stable for the lifetime of the module, so `resetIdsCache`
 * mutates it in place rather than replacing it.
 */
export const idsCache: IdsCache = {};

export function resetIdsCache(): void {
  for (const key of Object.keys(idsCache)) {
    delete idsCache[key];
  }
}

function generateIdFromName(name: string, id?: Identifier): Identifier {
  return id ?? Symbol(name);
}

export function generateIdName(constructorName: string): string {
  return constructorName.charAt(0).toUpperCase() + constructorName.slice(1);
}

function generateIdOfDependency(name: string, id?: Identifier): Identifier {
  return generateIdFromName(name, id);
}

function generateIdNameOfDependency(name: string, id?: Identifier): string {
  return id ? id.toString() : generateIdName(name);
}

export function addIdToCache(id: Identifier, name: string): Identifier {
  const existingId = idsCache[name];

  if (existingId) {
    return existingId;
  }

  // Register an `I`-prefixed alias too, so `cid.IService` matches `Service`.
  idsCache[`I${name}`] = id;

  return (idsCache[name] = id);
}

export function generateIdAndAddToCache(constructorName: string, id?: Identifier): Identifier {
  const dependencyId = generateIdOfDependency(constructorName, id);
  const dependencyIdName = generateIdNameOfDependency(constructorName, id);

  return addIdToCache(dependencyId, dependencyIdName);
}

export function getOrSetIdFromCache(dependencyIdName: string, id?: Identifier): Identifier {
  const cachedId = idsCache[dependencyIdName];

  if (cachedId) {
    return cachedId;
  }

  return addIdToCache(generateIdFromName(dependencyIdName, id), dependencyIdName);
}

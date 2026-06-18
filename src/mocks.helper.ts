import { Newable } from 'inversify';
import { getContainer } from './container';
import { Identifier } from './id.helper';

export function mockSingleton<T>(id: Identifier, to: Newable<T>): void {
  getContainer().unbind(id);
  getContainer().addSingleton<T>(to, id);
}

export function mockTransient<T>(id: Identifier, to: Newable<T>): void {
  getContainer().unbind(id);
  getContainer().addTransient<T>(to, id);
}

export function mockRequest<T>(id: Identifier, to: Newable<T>): void {
  getContainer().unbind(id);
  getContainer().addRequest<T>(to, id);
}

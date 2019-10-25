import { interfaces } from 'inversify';
import { cid, Container as PropsContainer, Inject, inject, injectable } from 'inversify-props';
import { useContainer } from './use-service.hook';

class Container extends PropsContainer {
  public addSingleton<T>(constructor: {
    new(...args: any[]): T;
  }, id?: string): interfaces.BindingWhenOnSyntax<T> {

    const binding = super.addSingleton<T>(constructor);

    return binding;
  }
}

const container: Container = new Container();

export { useContainer, Inject, inject, injectable, Container, cid };


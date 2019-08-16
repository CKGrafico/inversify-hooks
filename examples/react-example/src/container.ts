import { container } from 'inversify-hooks';
import { IService1, Service1, IService2, Service2, IService3, Service3, Service4, IService4  } from './shared';

export function containerBuilder(): void {
  container.addSingleton<IService1>(Service1);
  container.addSingleton<IService4>(Service4);
  container.addSingleton<IService3>(Service3);
  container.addSingleton<IService2>(Service2);
}

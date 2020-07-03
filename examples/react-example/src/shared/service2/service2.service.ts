import { inject } from 'inversify-hooks';
import { IService3 } from '../service3';
import { IService2 } from './iservice2.service';

export class Service2 implements IService2 {
  @inject(null, true) service3: IService3;

  method2(): string {
    return 'method 2 ' + this.service3.method3();
  }
}

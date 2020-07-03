import { inject } from 'inversify-hooks';
import { IService4 } from '../service4';
import { IService1 } from './iservice1.service';

export class Service1 implements IService1 {
  @inject() private service4: IService4;

  method1(): string {
    console.log(this.service4);
    return 'method 1';
  }
}

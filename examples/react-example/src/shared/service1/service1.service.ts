import { IService1 } from './iservice1.service';
import { injectable, inject } from 'inversify-hooks';
import { IService4 } from '../service4';


@injectable()
export class Service1 implements IService1 {
  @inject() private service4: IService4

  method1(): string {
    console.log(this.service4)
    return 'method 1';
  }
}

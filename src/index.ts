import { cid, Container as PropsContainer, Inject, inject, injectable } from 'inversify-props';
import { useContainer } from './use-service.hook';

class Container extends PropsContainer {

}

const container: Container = new Container();

export { useContainer, Inject, inject, injectable, Container, cid };


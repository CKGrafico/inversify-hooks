import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { cid, container, inject, injectable, mockSingleton, resetContainer, useInject } from './index';

interface IGreeter {
  greet(): string;
}

class Greeter implements IGreeter {
  greet(): string {
    return 'hello';
  }
}

class LoudGreeter implements IGreeter {
  greet(): string {
    return 'HELLO';
  }
}

interface IGreetingService {
  message(): string;
}

@injectable()
class GreetingService implements IGreetingService {
  // Property injection, id inferred from the property name -> "Greeter".
  @inject() private greeter!: IGreeter;

  message(): string {
    return `${this.greeter.greet()} world`;
  }
}

describe('inversify-hooks', () => {
  afterEach(() => {
    resetContainer();
  });

  it('resolves a registered dependency through useInject', () => {
    container.addSingleton<IGreeter>(Greeter);

    function Component() {
      const [greeter] = useInject<IGreeter>(cid.IGreeter);
      return <span>{greeter.greet()}</span>;
    }

    render(<Component />);
    expect(screen.getByText('hello')).toBeDefined();
  });

  it('returns the same instance for a singleton', () => {
    container.addSingleton<IGreeter>(Greeter);

    const [a] = useInject<IGreeter>(cid.IGreeter);
    const [b] = useInject<IGreeter>(cid.IGreeter);

    expect(a).toBe(b);
  });

  it('injects dependencies into other services via @inject', () => {
    container.addSingleton<IGreeter>(Greeter);
    container.addSingleton<IGreetingService>(GreetingService);

    const [service] = useInject<IGreetingService>(cid.IGreetingService);

    expect(service.message()).toBe('hello world');
  });

  it('supports swapping an implementation with mockSingleton', () => {
    container.addSingleton<IGreeter>(Greeter);
    mockSingleton<IGreeter>(cid.IGreeter, LoudGreeter);

    const [greeter] = useInject<IGreeter>(cid.IGreeter);

    expect(greeter.greet()).toBe('HELLO');
  });

  it('resolves by a custom id', () => {
    container.addSingleton<IGreeter>(Greeter, 'MyGreeter');

    const [greeter] = useInject<IGreeter>('MyGreeter');

    expect(greeter.greet()).toBe('hello');
  });
});

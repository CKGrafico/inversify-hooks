import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cid,
  container,
  getContainer,
  inject,
  injectable,
  mockSingleton,
  mockTransient,
  resetContainer,
  setContainer,
  useInject
} from './index';

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

@injectable()
class AliasedService implements IGreetingService {
  // Property injection with an explicit id.
  @inject(cid.IGreeter) private greeter!: IGreeter;

  message(): string {
    return `${this.greeter.greet()}!`;
  }
}

interface IBanner {
  text(): string;
}

@injectable()
class Banner implements IBanner {
  // Constructor injection, id inferred from the parameter name -> "Greeter".
  constructor(@inject() private greeter: IGreeter) {}

  text(): string {
    return `[${this.greeter.greet()}]`;
  }
}

// Plain class used to observe instance identity across scopes.
class Box {}

describe('inversify-hooks', () => {
  afterEach(() => {
    resetContainer();
  });

  describe('useInject', () => {
    it('resolves a registered dependency and renders it', () => {
      container.addSingleton<IGreeter>(Greeter);

      function Component() {
        const [greeter] = useInject<IGreeter>(cid.IGreeter);
        return <span>{greeter.greet()}</span>;
      }

      render(<Component />);
      expect(screen.getByText('hello')).toBeDefined();
    });

    it('resolves by a custom id', () => {
      container.addSingleton<IGreeter>(Greeter, 'MyGreeter');

      const [greeter] = useInject<IGreeter>('MyGreeter');

      expect(greeter.greet()).toBe('hello');
    });
  });

  describe('scopes', () => {
    it('returns the same instance for a singleton', () => {
      container.addSingleton(Box);

      const [a] = useInject<Box>(cid.Box);
      const [b] = useInject<Box>(cid.Box);

      expect(a).toBe(b);
    });

    it('returns a new instance per resolve for a transient', () => {
      container.addTransient(Box);

      const [a] = useInject<Box>(cid.Box);
      const [b] = useInject<Box>(cid.Box);

      expect(a).not.toBe(b);
    });

    it('resolves a request-scoped dependency', () => {
      container.addRequest(Box);

      const [a] = useInject<Box>(cid.Box);

      expect(a).toBeInstanceOf(Box);
    });
  });

  describe('@inject', () => {
    it('injects into a service via property name', () => {
      container.addSingleton<IGreeter>(Greeter);
      container.addSingleton<IGreetingService>(GreetingService);

      const [service] = useInject<IGreetingService>(cid.IGreetingService);

      expect(service.message()).toBe('hello world');
    });

    it('injects into a service via an explicit id', () => {
      container.addSingleton<IGreeter>(Greeter);
      container.addSingleton<IGreetingService>(AliasedService);

      const [service] = useInject<IGreetingService>(cid.IAliasedService);

      expect(service.message()).toBe('hello!');
    });

    it('injects via a constructor parameter name', () => {
      container.addSingleton<IGreeter>(Greeter);
      container.addSingleton<IBanner>(Banner);

      const [banner] = useInject<IBanner>(cid.IBanner);

      expect(banner.text()).toBe('[hello]');
    });
  });

  describe('mocks', () => {
    it('swaps an implementation with mockSingleton', () => {
      container.addSingleton<IGreeter>(Greeter);
      mockSingleton<IGreeter>(cid.IGreeter, LoudGreeter);

      const [greeter] = useInject<IGreeter>(cid.IGreeter);

      expect(greeter.greet()).toBe('HELLO');
    });

    it('swaps an implementation with mockTransient', () => {
      container.addSingleton<IGreeter>(Greeter);
      mockTransient<IGreeter>(cid.IGreeter, LoudGreeter);

      const [a] = useInject<IGreeter>(cid.IGreeter);
      const [b] = useInject<IGreeter>(cid.IGreeter);

      expect(a.greet()).toBe('HELLO');
      expect(a).not.toBe(b);
    });
  });

  describe('container lifecycle', () => {
    it('unbinds everything on resetContainer', () => {
      container.addSingleton<IGreeter>(Greeter);
      expect(getContainer().isBound(cid.IGreeter)).toBe(true);

      resetContainer();

      expect(getContainer().isBound(cid.IGreeter)).toBe(false);
    });

    it('replaces the active container with setContainer', () => {
      container.addSingleton<IGreeter>(Greeter);
      const fresh = setContainer();

      expect(getContainer()).toBe(fresh);
      expect(getContainer().isBound(cid.IGreeter)).toBe(false);
    });
  });
});

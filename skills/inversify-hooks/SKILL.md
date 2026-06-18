---
name: inversify-hooks
description: Set up and use dependency injection in React with inversify-hooks (a React layer over inversify-props / InversifyJS 8). Use when wiring up a DI container in a React app, injecting services into components via the useInject hook, registering singletons/transients, injecting dependencies into other services with @inject, or mocking injected services in tests.
---

# inversify-hooks

`inversify-hooks` is a small React layer over [inversify-props](https://github.com/CKGrafico/inversify-props) (which wraps [InversifyJS](https://inversify.io/) 8) that lets React components resolve dependencies from an IoC container through a `useInject` hook. Use this skill when adding or working with dependency injection in a React + TypeScript codebase that uses (or wants to use) this library.

## When to use this skill

- Setting up an InversifyJS container in a React app and injecting services into components.
- Reaching for `useInject`, `container.addSingleton`, `@inject`, or `cid` and being unsure of the exact API or required TypeScript config.
- Injecting a service into another service (not just into a component).
- Writing tests that need to swap a real service for a mock.
- Debugging "no matching bindings", `undefined` injected properties, or production builds where injection works in dev but breaks after minification.

## Setup (do this once)

1. Install (inversify comes bundled as a dependency; no separate `reflect-metadata` needed):
   ```bash
   npm install inversify-hooks
   ```
   `react` (>= 16.8) is the only peer dependency.

2. The `tsconfig.json` **must** enable legacy decorator support, or injection silently fails:
   ```jsonc
   {
     "compilerOptions": {
       "experimentalDecorators": true,
       "useDefineForClassFields": false // critical: see "Gotchas"
     }
   }
   ```

## Registering dependencies

Register services on the shared `container` once, before the app renders:

```ts
import { container } from 'inversify-hooks';
import { IUserService, UserService } from './services';

export function buildContainer(): void {
  container.addSingleton<IUserService>(UserService);   // one shared instance
  // container.addTransient<T>(Cls);  // new instance per resolve
  // container.addRequest<T>(Cls);    // one instance per request scope
  // container.addSingleton<T>(Cls, 'CustomId'); // explicit id
}
```

The generic argument (`<IUserService>`) is only the TypeScript type. The **runtime id is derived from the class name** (`UserService`), and `inversify-hooks` registers it under both `UserService` and `IUserService` keys in the `cid` cache. So `cid.IUserService` resolves the `UserService` registration.

## Injecting into components

`useInject<T>(id)` returns a **one-element tuple**:

```tsx
import { cid, useInject } from 'inversify-hooks';
import { IUserService } from './services';

function Profile() {
  const [userService] = useInject<IUserService>(cid.IUserService);
  // or a custom id: useInject<IUserService>('CustomId')
  return <span>{userService.getName()}</span>;
}
```

## Injecting into other services

Use `@inject()` for property injection. The id is resolved from the **property name**, so name the property after the service class:

```ts
import { inject, injectable } from 'inversify-hooks';

@injectable()
export class OrderService implements IOrderService {
  @inject() private userService!: IUserService; // resolves id "UserService"
}
```

Add `@injectable()` to injectable classes. Property injection is lazy — the dependency is resolved from the container on first access.

## Testing with mocks

Swap a registered implementation for a fake, then reset between tests:

```ts
import { cid, mockSingleton, resetContainer } from 'inversify-hooks';

afterEach(() => resetContainer());

it('uses the user service', () => {
  mockSingleton<IUserService>(cid.IUserService, FakeUserService);
  // ...render and assert
});
```

`mockTransient` and `mockRequest` exist with the same signature. `resetContainer()` unbinds everything.

## Full export surface

`useInject`, `inject` / `Inject`, `injectable`, `container`, `getContainer`, `setContainer`, `resetContainer`, `Container`, `cid`, `mockSingleton`, `mockTransient`, `mockRequest`.

## Gotchas

- **`useDefineForClassFields` must be `false`** (it defaults to `false` only when `target` is below `ES2022`). With class-field define semantics on, the instance field shadows the injected getter and the property is `undefined`. Keep `target` at `ES2020` or set the flag explicitly.
- **Minification must keep names.** Ids come from `constructor.name`. If a bundler mangles class names, `cid.IXxx` becomes `undefined` and resolution fails in production only. Enable `keepNames` (esbuild/Vite) or the equivalent Terser/Uglify setting.
- **Use legacy decorators, not TC39.** inversify 8 still requires `experimentalDecorators: true`. Do not enable the standard/stage-3 decorators for these classes.
- **Register before render.** Call the container-builder before `createRoot(...).render(...)`, otherwise `useInject` resolves an unbound id.
- The package ships **both ESM and CommonJS** builds. Bundlers need no special config; consuming via `require()` from plain Node needs Node 20.19+ or 22+ (an inversify 8 requirement).

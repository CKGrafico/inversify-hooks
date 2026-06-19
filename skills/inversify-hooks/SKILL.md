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
- Wiring the container into a Next.js App Router app (or any framework without a `createRoot` you control) where `useInject` throws `No bindings found` on first render.

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

> **Do NOT pass a `cid` symbol as the first argument.** `container.addSingleton(cid.IUserService, UserService)` is wrong — `addSingleton` takes the class (and an optional *string* id), not a symbol. Passing a symbol throws an opaque `TypeError` with no message. The only correct forms are:
> ```ts
> container.addSingleton<IUserService>(UserService);          // ✅ id from class name
> container.addSingleton<IUserService>(UserService, 'MyId');  // ✅ explicit string id
> container.addSingleton(cid.IUserService, UserService);      // ❌ throws TypeError
> ```

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

## Next.js App Router (and other frameworks without a `createRoot` you control)

There is no `createRoot(...).render(...)` line you own, so "register before render" means **register at module-load time**, not in an effect.

`useInject` resolves the binding **during render**. `useEffect` runs **after** the first render, so building the container in an effect is too late — the first render throws `No bindings found` before the effect ever runs.

Call `buildContainer()` at the **top level** of a `'use client'` module that the root layout imports:

```tsx
// app/di-provider.tsx
'use client';
import { buildContainer } from '@/lib/di';

buildContainer(); // runs once when this module is first imported — before any render

export function DIProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

```tsx
// app/layout.tsx
import { DIProvider } from './di-provider';

export default function RootLayout({ children }) {
  return (
    <html><body>
      <DIProvider>{children}</DIProvider>
    </body></html>
  );
}
```

- ❌ **Do not** call `buildContainer()` inside `useEffect` — render runs first and `useInject` fails.
- ✅ Top-level call in a `'use client'` module is idempotent enough for a singleton container; guard with a module-level boolean if your `buildContainer` is not safe to call twice.

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

## Troubleshooting (symptom → cause)

| Symptom | Cause | Fix |
| --- | --- | --- |
| `No bindings found for service: "Symbol(Foo)"` at a component using `useInject(cid.IFoo)` | Container was never built, or was built *after* render (e.g. in `useEffect`). | Call `buildContainer()` at module load before render — see the Next.js section. |
| Opaque `TypeError` (no message) thrown from `container.addSingleton(...)` | A `cid` symbol was passed as the first argument. `addSingleton` expects the class, plus an optional **string** id. | Use `container.addSingleton<IFoo>(Foo)`. |
| Injection works in `dev`, `cid.IFoo` is `undefined` in production | Minifier mangled the class name; `cid` keys come from `constructor.name`. | Enable `keepNames` (esbuild/Vite) or the Terser equivalent. |
| `@inject()` property is `undefined` at runtime | `useDefineForClassFields: true` shadows the injected getter. | Set `useDefineForClassFields: false` (or keep `target` ≤ ES2020). |
| `No bindings found` only for services injected into *other* services via `@inject()` | Property name does not match the registered class name. | Name the property after the class (`@inject() private fooService!: IFooService` → id `FooService`), or pass an explicit id. |

## Gotchas

- **`useDefineForClassFields` must be `false`** (it defaults to `false` only when `target` is below `ES2022`). With class-field define semantics on, the instance field shadows the injected getter and the property is `undefined`. Keep `target` at `ES2020` or set the flag explicitly.
- **Minification must keep names.** Ids come from `constructor.name`. If a bundler mangles class names, `cid.IXxx` becomes `undefined` and resolution fails in production only. Enable `keepNames` (esbuild/Vite) or the equivalent Terser/Uglify setting.
- **Use legacy decorators, not TC39.** inversify 8 still requires `experimentalDecorators: true`. Do not enable the standard/stage-3 decorators for these classes.
- **Register before render.** Call the container-builder before the first render. With `createRoot(...).render(...)` call it just above that line; in Next.js App Router or any framework where you don't own the render call, build it at module-load time in a `'use client'` module the layout imports — **never in `useEffect`** (render runs first and `useInject` throws `No bindings found`). See "Next.js App Router".
- The package ships **both ESM and CommonJS** builds. Bundlers need no special config; consuming via `require()` from plain Node needs Node 20.19+ or 22+ (an inversify 8 requirement).

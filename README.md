# Inversify Hooks

Dependency injection for **React + TypeScript**, the easy way. `inversify-hooks` lets your components resolve services from an [InversifyJS](https://inversify.io/) container through a single `useInject` hook — no providers, no boilerplate. It's a thin React layer over [inversify-props](https://github.com/CKGrafico/inversify-props), which is built on **inversify 8**.

**[inversify-hooks.ckgrafico.com](https://inversify-hooks.ckgrafico.com)**

[![npm version](https://img.shields.io/npm/v/inversify-hooks.svg)](https://www.npmjs.com/package/inversify-hooks)
[![npm downloads](https://img.shields.io/npm/dm/inversify-hooks.svg)](https://www.npmjs.com/package/inversify-hooks)
[![GitHub license](https://img.shields.io/github/license/CKGrafico/inversify-hooks.svg)](https://github.com/CKGrafico/inversify-hooks/blob/main/LICENSE)
![GitHub last commit](https://img.shields.io/github/last-commit/CKGrafico/inversify-hooks/main.svg)
[![GitHub issues](https://img.shields.io/github/issues/CKGrafico/inversify-hooks.svg)](https://github.com/CKGrafico/inversify-hooks/issues)
[![skills.sh](https://skills.sh/b/CKGrafico/inversify-hooks)](https://skills.sh/CKGrafico/inversify-hooks)

![logo](https://i.imgur.com/syVbzU6.gif)

---

## Table of contents

- [Why](#why)
- [Installation](#installation)
- [TypeScript configuration](#typescript-configuration)
- [Quick start](#quick-start)
- [Registering dependencies](#registering-dependencies)
- [Injecting into components](#injecting-into-components)
- [Injecting into other services](#injecting-into-other-services)
- [Testing with mocks](#testing-with-mocks)
- [API reference](#api-reference)
- [Runnable example](#runnable-example)
- [Use it as an agent skill](#use-it-as-an-agent-skill)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

## Why

Sharing services across a React tree usually means prop-drilling or hand-rolled context. With `inversify-hooks` you register a class once and pull a fully-wired instance into any component:

```tsx
const [userService] = useInject<IUserService>(cid.IUserService);
```

That's the whole API surface for a component. The container, scoping, and wiring are handled for you by InversifyJS underneath.

## Installation

```bash
npm install inversify-hooks
```

`inversify-props` (and transitively `inversify`) is a regular dependency, pulled in for you; `react` (>= 16.8, for hooks) is the only **peer dependency**. TypeScript type definitions ship with the package, and both ESM and CommonJS builds are included. No separate `reflect-metadata` install is needed — inversify 8 no longer requires it.

> **Note:** inversify 8 is ESM-first. Bundler users (Vite, Next, webpack, etc.) need nothing special. Consuming it from a plain CommonJS Node app via `require()` needs Node 20.19+ or 22+.

## TypeScript configuration

Decorator support is required, or injection silently does nothing:

```jsonc
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020", "dom"],
    "moduleResolution": "bundler",
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

> ⚠️ Keep `useDefineForClassFields` **false** (the default when `target` is below `ES2022`). With ES class-field define semantics enabled, an instance field shadows the injected getter and the property comes back `undefined`. See [Troubleshooting](#troubleshooting).

## Quick start

```ts
// main.tsx — app entry point
import { createRoot } from 'react-dom/client';
import { container } from 'inversify-hooks';
import App from './App';
import { IUserService, UserService } from './services';

container.addSingleton<IUserService>(UserService);

createRoot(document.getElementById('root')!).render(<App />);
```

```tsx
// App.tsx
import { cid, useInject } from 'inversify-hooks';
import { IUserService } from './services';

export default function App() {
  const [userService] = useInject<IUserService>(cid.IUserService);
  return <h1>Hello, {userService.getName()}</h1>;
}
```

## Registering dependencies

Register on the shared `container` before the app renders. Three lifetimes are available:

```ts
import { container } from 'inversify-hooks';

container.addSingleton<IUserService>(UserService); // one shared instance (most common)
container.addTransient<ILogger>(Logger);           // a new instance on every resolve
container.addRequest<IUnitOfWork>(UnitOfWork);     // one instance per request scope
```

The generic (`<IUserService>`) is just the compile-time type. The **runtime id is derived from the class name** and cached under both `UserService` and `IUserService`, which is why `cid.IUserService` works. Need an explicit id? Pass one:

```ts
container.addSingleton<IUserService>(UserService, 'MyUserService');
```

```tsx
const [userService] = useInject<IUserService>('MyUserService');
```

## Injecting into components

`useInject<T>(id)` returns a **one-element tuple** (so you can name the variable on destructure):

```tsx
function Profile() {
  const [userService] = useInject<IUserService>(cid.IUserService);

  useEffect(() => {
    userService.load();
  }, [userService]);

  return <span>{userService.getName()}</span>;
}
```

## Injecting into other services

Services can depend on other services via `@inject()` property injection. The id is resolved from the **property name**, so name the property after the class you registered:

```ts
import { inject, injectable } from 'inversify-hooks';

@injectable()
export class OrderService implements IOrderService {
  @inject() private userService!: IUserService; // resolves the "UserService" registration

  placeOrder() {
    return this.userService.getName();
  }
}
```

Mark every injectable class with `@injectable()`. Property injection is lazy: the dependency is pulled from the container the first time it's accessed.

## Testing with mocks

Swap a real implementation for a fake and reset between tests:

```ts
import { cid, mockSingleton, resetContainer } from 'inversify-hooks';

afterEach(() => resetContainer());

it('greets the user', () => {
  mockSingleton<IUserService>(cid.IUserService, FakeUserService);
  // render the component / call the service and assert
});
```

`mockTransient` and `mockRequest` have the same signature. `resetContainer()` unbinds everything.

## API reference

| Export | Description |
| --- | --- |
| `useInject<T>(id)` | React hook. Returns `[T]` — the instance resolved for `id`. |
| `container` | The shared container instance (auto-created). |
| `container.addSingleton<T>(Class, id?)` | Register a single shared instance. |
| `container.addTransient<T>(Class, id?)` | Register a new instance per resolve. |
| `container.addRequest<T>(Class, id?)` | Register one instance per request scope. |
| `cid` | Cache of generated ids, e.g. `cid.IUserService`. |
| `inject` / `Inject` | Property/parameter decorator for injecting into services. |
| `injectable` | Class decorator marking a class as injectable. |
| `mockSingleton` / `mockTransient` / `mockRequest` | Replace a registered id with another implementation (testing). |
| `resetContainer()` | Unbind everything from the container. |
| `getContainer()` / `setContainer(opts)` | Access or replace the underlying InversifyJS container. |
| `Container` | The container class, if you want your own instance. |

## Runnable example

A complete **React + Vite** example lives in [`examples/react-example`](examples/react-example):

```bash
# from the repo root — build the library first
npm install && npm run build

cd examples/react-example
npm install
npm run dev
```

## Use it as an agent skill

This repo ships an [Agent Skill](skills/inversify-hooks/SKILL.md) so AI coding agents (Claude Code, Cursor, etc.) know how to wire up DI with this library. Install it with [`npx skills`](https://skills.sh):

```bash
npx skills add CKGrafico/inversify-hooks
```

## Troubleshooting

| Symptom | Cause & fix |
| --- | --- |
| Injected property is `undefined` | `useDefineForClassFields` is `true`. Set it to `false` (or keep `target` below `ES2022`). |
| Works in dev, breaks in production | The minifier mangled class names, so `cid.IXxx` is `undefined`. Enable `keepNames` (esbuild/Vite) or the equivalent Terser/Uglify setting. |
| `No matching bindings found` | The service wasn't registered, or registration ran after the component resolved. Register before `render`. |
| Decorators throw at runtime | `experimentalDecorators` is off in your `tsconfig.json`. |

## Credits

A thin React layer over [inversify-props](https://github.com/CKGrafico/inversify-props), built on [InversifyJS](https://inversify.io/). Licensed under [MIT](LICENSE).

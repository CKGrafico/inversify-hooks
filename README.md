# Inversify Hooks
This package is a wrapper of [inversify-props](https://github.com/ckgrafico/inversify-props) to simplify how inject your dependencies in components with hooks.

![GitHub last commit](https://img.shields.io/github/last-commit/CKGrafico/inversify-hooks/master.svg)
[![GitHub license](https://img.shields.io/github/license/CKGrafico/inversify-hooks.svg)](https://github.com/CKGrafico/inversify-hooks/blob/master/LICENSE)
[![GitHub forks](https://img.shields.io/github/forks/CKGrafico/inversify-hooks.svg)](https://github.com/CKGrafico/inversify-hooks/network)
![GitHub contributors](https://img.shields.io/github/contributors/CKGrafico/inversify-hooks.svg)
[![GitHub issues](https://img.shields.io/github/issues/CKGrafico/inversify-hooks.svg)](https://github.com/CKGrafico/inversify-hooks/issues)

![logo](https://i.imgur.com/syVbzU6.gif)

## Installation
```
$ npm install inversify-hooks reflect-metadata --save
```

The inversify-hooks type definitions are included in the inversify-hooks npm package.

## How to use
```
import 'reflect-metadata'; // Import only once
import { container, useInject } from 'inversify-hooks';

container.addSingleton<IService1>(Service1);

function ExampleComponent() {
  const [service1] = useInject<IService1>(cid.IService1);

  useEffect(() => {
    if (!service1) {
      return;
    }

    service1.asyncMethod();
  }, [])
}
```

## You can also use any ID that you prefer
```
container.addSingleton<IService1>(Service1, 'MyService1');

function ExampleComponent() {
  const service1 = useInject<IService1>('MyService1');
}
```

> :warning: **Important!** inversify-hooks requires TypeScript >= 2.0 and the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib`
compilation options in your `tsconfig.json` file.

```js
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["es6"],
        "types": ["reflect-metadata"],
        "module": "commonjs",
        "moduleResolution": "node",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

## How to test
There are more examples of how to test in [inversify-props](https://github.com/ckgrafico/inversify-props#how-to-test)

## More examples
There are more examples of how to use the container in services or other components in [inversify-props](https://github.com/ckgrafico/inversify-props#how-to-use)

## Why we made this package
You can learn more about why we made this packages in the [original repo](https://github.com/ckgrafico/inversify-props#why-we-made-this-package).

## How register a dependency
If you're not familizared of how to register dependencies, [check the docs](https://github.com/ckgrafico/inversify-props#how-register-a-dependency).

## How to configure Uglify or Terser
f you're using Uglify or Terser you need to configure well the plugin, [check the docs](https://github.com/ckgrafico/inversify-props#how-to-configure-uglify-or-terser).

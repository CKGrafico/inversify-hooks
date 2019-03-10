# Inversify Props
This package is a wrapper of [inversify-props](https://github.com/ckgrafico/inversify-props) to simplify how inject your dependencies in components with hooks.

![GitHub last commit](https://img.shields.io/github/last-commit/CKGrafico/inversify-hooks/master.svg)
[![GitHub license](https://img.shields.io/github/license/CKGrafico/inversify-hooks.svg)](https://github.com/CKGrafico/inversify-hooks/blob/master/LICENSE)
[![GitHub forks](https://img.shields.io/github/forks/CKGrafico/inversify-hooks.svg)](https://github.com/CKGrafico/inversify-hooks/network)
![GitHub contributors](https://img.shields.io/github/contributors/CKGrafico/inversify-hooks.svg)
[![GitHub issues](https://img.shields.io/github/issues/CKGrafico/inversify-hooks.svg)](https://github.com/CKGrafico/inversify-hooks/issues)

## Installation
```
npm install --save inversify-hooks
```

## Usage
```
container.addSingleton<IService1>(Service1);
container.addSingleton<IService2>(Service2);

function ExampleComponent() {
  const service1 = useService<IService1>('IService1');
}
```

## Why we made this package
You can learn more about why we made this packages in the [original repo](https://github.com/ckgrafico/inversify-props#why-we-made-this-package).

## How register a dependency
If you're not familizared of how to register dependencies, [check the docs](https://github.com/ckgrafico/inversify-props#how-register-a-dependency).

## How to use in your components
Once your dependencies are registered in the container, is simple use the hook to get the dependency.
```
function ExampleComponent() {
  const service1 = useService<IService1>('IService1');
}
```

## How to configure uglify
If you're using uglify or similar you need to [configure well the plugin](https://github.com/ckgrafico/inversify-props#how-to-configure-uglify).

## Next steps
- Remove id param, and use `magic if` like in inversify-props.


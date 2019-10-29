import { cid, useInject } from 'inversify-hooks';
import React, { useState } from 'react';
import { IService1 } from './shared';

function App() {
  const [count, setCount] = useState(0);
  const [service1] = useInject<IService1>(cid.IService1)

  console.log(service1.method1());

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
export default App;

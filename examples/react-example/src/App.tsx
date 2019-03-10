import React, { useState } from 'react';
import { IService1 } from './shared';
import { useService } from 'inversify-hooks';

function App() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  const service1 = useService<IService1>('IService1');
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

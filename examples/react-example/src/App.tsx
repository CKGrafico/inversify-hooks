import { container } from 'inversify-hooks';
import React, { useState } from 'react';
import { IService1 } from './shared';

function App() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  const a: IService1 = container.get('IService1');
  console.log(a.method1());

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

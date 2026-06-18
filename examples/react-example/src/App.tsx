import { useState } from 'react';
import { cid, useInject } from 'inversify-hooks';
import { IService1 } from './shared';

function App() {
  const [service1] = useInject<IService1>(cid.IService1);
  const [message, setMessage] = useState('');

  return (
    <div>
      <h1>inversify-hooks example</h1>
      <p>
        The button below calls a method on a service resolved from the
        container via <code>useInject</code>.
      </p>
      <button onClick={() => setMessage(service1.method1())}>
        Call service1.method1()
      </button>
      {message && <p>Result: {message}</p>}
    </div>
  );
}

export default App;

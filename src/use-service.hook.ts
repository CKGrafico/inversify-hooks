import { useState, useEffect } from 'react';
import { container } from 'inversify-props';

export function useContainer<T>(id: string | symbol): [T] {
  const [dependency, setDependency] = useState();

  useEffect(() => {
    setDependency(container.get(id));
  }, []);


  return [dependency as T]
}

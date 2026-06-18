import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// tsDecorators enables legacy decorators, which inversify-hooks relies on for
// property injection (e.g. `@inject()`).
// keepNames is required because container ids are derived from class names
// (constructor.name); minification must not mangle them.
export default defineConfig({
  plugins: [react({ tsDecorators: true })],
  esbuild: {
    keepNames: true
  }
});

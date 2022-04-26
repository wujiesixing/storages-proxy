import filesize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.module.replace(/\.min(\.js)$/, '$1'),
      format: 'es',
    },
    {
      file: pkg.module,
      format: 'es',
      plugins: [terser(), filesize()],
    },
    {
      name: 'Storages',
      file: pkg.main.replace(/\.min(\.js)$/, '$1'),
      format: 'iife',
    },
    {
      name: 'Storages',
      file: pkg.main,
      format: 'iife',
      plugins: [terser(), filesize()],
    },
  ],
  plugins: [
    license({
      banner: {
        content:
          '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */',
        commentStyle: 'none',
      },
    }),
  ],
};

import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import filesize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    {
      name: 'Storages',
      file: pkg.main,
      format: 'iife',
      sourcemap: true,
      plugins: [
        terser({
          sourceMap: true,
        }),
      ],
    },
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    nodeResolve(),
    typescript({
      tsconfig: 'tsconfig.dom.json',
    }),
    license({
      banner: {
        content:
          '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */',
        commentStyle: 'none',
      },
    }),
    filesize(),
  ],
};

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/es/index.js',
      format: 'es',
    },
    {
      name: 'Storages',
      file: 'dist/iife/index.js',
      format: 'iife',
    },
  ],
};

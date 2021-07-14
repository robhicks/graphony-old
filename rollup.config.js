import { resolve } from 'path';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const root = process.cwd();

require('./test/makeTestEntry')();

const plugins = [
  json(),
  nodeResolve({ preferBuiltins: true}),
];

const client = resolve(root, 'src', 'client.js');
const server = resolve(root, 'src', 'server.js');
const main = resolve(root, 'src', 'index.js');

export default [
  {
    input: main,
    plugins,
    output: {
      file: resolve(root, 'dist', 'graphony.js'),
      format: 'es',
      inlineDynamicImports: true,
    },
  },
  {
    input: client,
    plugins,
    output: {
      file: resolve(root, 'dist', 'graphony-client.js'),
      format: 'es',
      inlineDynamicImports: true,
    },
  },
  {
    input: server,
    plugins,
    output: {
      file: 'index.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
  },
  {
    input: server,
    plugins,
    output: {
      file: 'index.mjs',
      format: 'es',
      inlineDynamicImports: true,
    },
  },

];

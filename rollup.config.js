import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

require('./test/makeTestEntry')();

const plugins = [
  json(),
  nodeResolve(),
];

const client = './src/GraphonyClient.js';
const server = './src/GraphonyServer.js';

export default [
  {
    input: client,
    plugins,
    output: {
      file: 'dist/graphony.js',
      format: 'es',
    },
  },
  {
    input: server,
    plugins,
    output: {
      file: 'index.js',
      format: 'cjs',
    },
  },
  {
    input: server,
    plugins,
    output: {
      file: 'index.mjs',
      format: 'es',
    },
  },

];

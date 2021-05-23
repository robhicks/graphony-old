import { liveServer } from 'rollup-plugin-live-server';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';

const production = !process.env.ROLLUP_WATCH;

require('./test/makeTestEntry')();

const plugins = [
  nodeResolve(),
  commonJs(),
  !production && liveServer({
    port: 8080,
    host: '0.0.0.0',
    root: 'public',
    file: 'index.html',
    mount: [['/dist', './dist'], ['/src', './src'], ['/test', './test'], ['/node_modules', './node_modules']],
    open: false,
    wait: 500,
  }),
];

const client = './src/client.js';
const server = './src/server.js';

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
    input: 'test/globals.js',
    plugins: [
      nodeResolve(),
      commonJs(),
    ],
    output: {
      file: 'public/tests.js',
      format: 'es',
    },
  },
];

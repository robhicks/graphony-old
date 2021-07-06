const level = require('level');
const { GraphonyServer, LevelKeyStore } = require('../index.js');
const { resolve } = require('path');
const root = process.cwd();
const fastify = require('fastify')();
fastify.register(require('fastify-websocket'))

const store = new LevelKeyStore(level, resolve(root, 'GraphonyDb'));

new GraphonyServer({server: fastify, port: 3001, store});


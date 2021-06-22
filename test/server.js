const http = require('http');
jwt = require('jsonwebtoken');
const level = require('level');
const { Graphony, LevelKeyStore, WebsocketServer } = require('../index.js');
const ws = require('ws');
const { resolve } = require('path');
const root = process.cwd();

const WebSocket = ws;
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const store = new LevelKeyStore(level, resolve(root, 'GraphonyDb'));

const wss1 = new WebsocketServer({
  port: 8081,
  server,
  store,
  wss
})

new Graphony({ wss: wss1 });
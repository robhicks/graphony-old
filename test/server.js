const http = require('http');
jwt = require('jsonwebtoken');
const level = require('level');
const { Graphony, LevelKeyStore, WebSocketServer } = require('../index.js');
const ws = require('ws');

const WebSocket = ws;
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const store = new LevelKeyStore(level);

const wss1 = new WebSocketServer({
  port: 8081,
  server,
  store,
  wss
})

new Graphony({ wss: wss1 });
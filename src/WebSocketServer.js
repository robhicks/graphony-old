/* eslint-disable no-console */
import TinyUri from 'tiny-uri';
import { deserialize } from './utils/deserialize';
import { heartbeat } from './utils/heartbeat';
import { noop } from './utils/noop';
import { serialize } from './utils/serialize';

export class WebSocketServer {
  constructor(options = {}) {
    this.subscriptions = new Map();
    this.port = options.port || 8081;
    this.server = options.httpServer;
    this.WebSocketServer = options.WebSocketServer;
    this.liveCheckId = null;
    this.liveCheckInterval = 30000;

    this.wss = new this.WebSocketServer.Server({ clientTracking: true, server: this.server });
    this.wss.on('close', this.onClose.bind(this));
    this.wss.on('connection', this.onConnection.bind(this));

    this.server.listen(this.port);

    this.server.on('listening', this.onListening.bind(this));
    this.server.on('upgrade', this.onUpgrade.bind(this));

    this.checkConnections();
  }

  broadcast({ all = false, data, ws }) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === this.WebSocketServer.OPEN) {
        const payload = serialize(data);
        if (all) {
          client.send(payload);
        } else if (client !== ws) {
          client.send(payload);
        }
      }
    });
  }

  broadcastToSubscribers({ data, path, gid }) {
    this.subscriptions.forEach((client, key) => {
      if (!key.includes(gid)
      && key.includes(path)
      && client.readyState === this.WebSocketServer.OPEN) {
        client.send(serialize({ ...data, ...{ action: 'PUBLISHED' } }));
      }
    });
  }

  checkConnections() {
    this.liveCheckId = setInterval(() => {
      this.wss.clients.forEach((cl) => {
        const client = cl;
        if (client.isAlive === false) return client.terminate();
        client.isAlive = false;
        client.ping(noop);
      });
    }, this.liveCheckInterval);
  }

  onClose() {
    clearInterval(this.liveCheckId);
  }

  onConnection(ws) {
    const socket = ws;
    socket.isAlive = true;
    socket.on('pong', heartbeat);
    socket.on('message', this.onMessage.bind(this, ws));
    console.log('onConnection');
  }

  onListening() {
    console.warn(`wss listening on port ${this.port}`);
  }

  onMessage(ws, msg) {
    // console.log('msg', msg);
    const message = deserialize(msg);
    const {
      action, data, gid, path,
    } = message;
    // console.log('action', action);
    // console.log('data', data);
    // console.log('path', path);
    switch (action) {
    case 'LOAD':
      // console.log('load::path', path);
      this.store.get(path).then((val) => {
        // console.log('val', val);
        if (val?.value) {
          ws.send(serialize({ ...val, ...{ action: 'LOAD_RESPONSE' } }));
        }
      });
      break;
    case 'RPC':
      this.store.get(path).then((val) => {
        // console.log('val', val);
        if (val?.value) {
          ws.send(serialize({ ...val, ...{ action: 'RPC' } }));
        }
      });
      break;
    case 'PUBLISH':
      console.log('publish::path', path);
      console.log('publish::data', data);
      this.store.put(path, data).catch((err) => console.log('err', err));
      this.broadcastToSubscribers({ data, path, gid });
      break;
    case 'SUBSCRIBE':
      this.subscriptions.set(`${path}:${gid}`, ws);
      break;
    default: break;
    }
  }

  onUpgrade(req, socket, head) {
    // console.log('onUpgrade');
    console.log('req.url', req.url);
    const url = new TinyUri(req.url);
    console.log('url.path', url.path.toString());
  }
}

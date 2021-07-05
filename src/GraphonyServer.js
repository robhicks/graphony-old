/* eslint-disable no-console */
import WebSocket from 'ws';
import polka from 'polka';
import cors from 'cors';
import { Graphony } from './Graphony';
import { deserialize } from './utils/deserialize';
import { serialize } from './utils/serialize';
import { heartbeat } from './utils/heartbeat';
import { noop } from './utils/noop';

export class GraphonyServer extends Graphony {
  constructor(options = {}) {
    super(options);
    this.port = options.port || 3001;
    this.subscriptions = new Map();
    this.liveCheckId = null;
    this.liveCheckInterval = 30000;
    this.cors = cors({ origin: '*' });
    this.server = polka();
    this.server.use(cors);
    this.wss = new WebSocket.Server({ clientTracking: true, server: this.server.server });

    this.wss.on('close', this.onClose.bind(this));
    this.wss.on('connection', this.onConnection.bind(this));
    this.checkConnections();

    this.server.get('/', async (request, reply) => {
      const { path } = request.query;
      const data = await this.store.get(path);
      reply.send(data);
    });

    this.server.listen(this.port, (err) => {
      if (err) console.error('err', err);
      else console.warn(`server listening on port: ${this.port}`);
    });
  }

  broadcastToSubscribers({ data, path, gid }) {
    this.subscriptions.forEach((client, key) => {
      if (!key.includes(gid)
        && key.includes(path)
        && client.readyState === 1) {
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

  onMessage(msg) {
    // console.log('msg', msg);
    const message = deserialize(msg);
    const {
      action, data, gid, path,
    } = message;
    // console.log('action', action);
    // console.log('data', data);
    // console.log('path', path);
    switch (action) {
    case 'PUBLISH':
      this.store.put(path, data).catch((err) => console.log('err', err));
      this.broadcastToSubscribers({ data, path, gid });
      break;
    case 'SUBSCRIBE':
      this.subscriptions.set(`${path}:${gid}`, this.socket);
      break;
    default: break;
    }
  }
}

export { LevelKeyStore } from './utils/LevelKeyStore';
export { MemoryStore } from './utils/MemoryStore';

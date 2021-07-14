/* eslint-disable no-console */
import polka from 'polka';
import cors from 'cors';
import WebSocket from 'ws';
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
    this.server = options.httpServer;

    this.server = this.server || polka();
    this.server.use(cors({ origin: '*' }));
    this.wss = new WebSocket.Server({ clientTracking: true, server: this.server.server });
    this.wss.on('close', this.onClose.bind(this));
    this.wss.on('connection', this.onConnection.bind(this));

    this.server.get('/', async (req, res) => {
      const { path } = req.query;
      const data = await this.store.get(path);
      // console.log('server.get::data', data);
      res.end(JSON.stringify(data));
    });

    this.server.listen(this.port, (err) => {
      if (err) console.error('err', err);
      else console.warn(`server listening on port: ${this.port}`);
    });

    this.checkConnections();
  }

  broadcastToSubscribers({ data, path, gid }) {
    // console.log('this.subscriptions.size', this.subscriptions.size);
    this.subscriptions.forEach((client, key) => {
      console.log('key', key);
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
    console.log('onConnection');
    const socket = ws;
    socket.isAlive = true;
    socket.on('pong', heartbeat);
    socket.on('message', this.onMessage.bind(this, socket));
  }

  onMessage(ws, msg) {
    // console.log('msg', msg);
    const socket = ws;
    const message = deserialize(msg);
    console.log('message', message);

    const { action, gid, path } = message;

    console.log('action', action);
    // console.log('data', data);
    // console.log('path', path);
    switch (action) {
    case 'PUBLISH':
      // console.log('PUBLISH::path', path);
      this.store.put(path, message).catch((err) => console.log('err', err));
      this.broadcastToSubscribers({ data: message, path, gid });
      break;
    case 'SUBSCRIBE':
      console.log(`${path}:${gid}`);
      this.subscriptions.set(`${path}:${gid}`, socket);
      break;
    default: break;
    }
  }
}

import { uuid } from './utils/uuid';
import { deepEquals } from './utils/deepEquals';
import isBrowser from './utils/isBrowser';

export default class Node {
  constructor(path, ctx) {
    this.browser = isBrowser;
    this.server = !isBrowser;
    this.path = path;
    this.events = ctx.events;
    this.nodeId = uuid();
    this.store = ctx.store;
    this.wsc = ctx.wsc;
    this.wss = ctx.wss;
    this.register();
    this.load();
    this.listen();
  }

  del() {
    this.events.clear();
    this.store.del(this.path);
  }

  async getValue() {
    return this.store.get(this.path);
  }

  listen() {
    if (this.wsc?.socket) {
      this.wsc.socket.addEventListener('message', ({ action, path, data }) => {
        console.log('action', action);
        console.log('path', path);
        console.log('data', data);
      });
    }
  }

  async load() {
    try {
      const val = await this.getValue();
      if (this.wsc?.socket) {
        this.wsc.socket.addEventListener('open', () => {
          const get = { action: 'GET', path: this.path };
          this.wsc.socket.send(JSON.stringify(get));
        });
      }
      this.events.emit(this.path, val);
    } catch (err) {
      // eat it
    }
  }

  register() {
    if (this.wsc?.socket) {
      this.wsc.socket.addEventListener('open', () => {
        const get = { action: 'register', path: this.path };
        this.wsc.socket.send(JSON.stringify(get));
      });
    }
  }

  async setValue(val) {
    const value = await this.store.get(this.path);
    if (!deepEquals(val, value)) {
      await this.store.put(this.path, val, true);
      this.events.emit(this.path, val);
      if (this.wsc?.socket) {
        const payload = { action: 'PUT', path: this.path, data: val };
        this.wsc.socket.send(JSON.stringify(payload));
      }
    }
  }
}

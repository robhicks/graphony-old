import isEqual from 'lodash.isequal';
import { uuid } from './utils/uuid';
import isBrowser from './utils/isBrowser';

const utc = () => Math.floor(new Date().getTime() / 1000);

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
    this.user = ctx.user;
    this.load();
    this.version = 0;
  }

  async del() {
    this.events.clear();
    const stored = await this.getValue(true);
    if (stored) this.store.del(this.path);
    this.send('DEL');
  }

  async getValue(raw = false) {
    const stored = await this.store.get(this.path);
    this.version = stored?.version || this.version;
    if (stored) {
      if (raw) return stored;
      return stored.value;
    }
    return null;
  }

  async load() {
    try {
      const val = await this.getValue(true);
      this.events.emit(this.path, val?.value ? val.value : val);
      if (this.wsc && this.wsc.ready && this.wsc.ready()) {
        const payload = { action: 'GET', path: this.path, data: val };
        this.wsc.send(payload);
      }
    } catch (err) {
      // eat it
    }
  }

  async send(action = 'GET') {
    if (this?.wsc?.send) {
      const val = await this.getValue(true);
      const payload = { ...{ action, path: this.path }, ...val };
      this.wsc.send(payload);
    }
  }

  async setValue(val, response) {
    if (!response) {
      const data = {
        value: val,
        path: this.path,
        updated: utc(),
        updatedBy: this.user.uid,
        // eslint-disable-next-line no-plusplus
        version: ++this.version,
      };
      this.store.put(this.path, data, true);
      this.events.emit(this.path, data.value);
      this.send('PUT');
    } else {
      this.store.put(this.path, response, true);
      this.events.emit(this.path, val);
    }
  }
}

import { uuid } from './utils/uuid';
import isBrowser from './utils/isBrowser';

const utc = () => Math.floor(new Date().getTime() / 1000);

const canRead = (currentUser, storedData) => currentUser === storedData.user
  || storedData.readers.includes(currentUser)
  || storedData.writers.includes(currentUser);

const canWrite = (currentUser, storedData) => currentUser === storedData.user
  || storedData.writers.includes(currentUser);

export default class Node {
  constructor(path, ctx, { readers = [], writers = [] } = []) {
    this.browser = isBrowser;
    this.server = !isBrowser;
    this.path = path;
    this.events = ctx.events;
    this.nodeId = uuid();
    this.store = ctx.store;
    this.wsc = ctx.wsc;
    this.wss = ctx.wss;
    this.owner = ctx.user.uid;
    this.readers = readers;
    this.writers = writers;
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

    if (stored && canRead(this.owner, stored)) {
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

  storeEmitAndSend(data, includeNet = false) {
    this.store.put(this.path, data, true);
    this.events.emit(this.path, data.value);
    if (includeNet) this.send('PUT');
  }

  async setValue(val, response) {
    const data = response || {
      value: val,
      owner: this.owner,
      path: this.path,
      readers: this.readers,
      updated: utc(),
      updatedBy: this.owner.uid,
      writers: this.writers,
      // eslint-disable-next-line no-plusplus
      version: ++this.version,
    };
    const stored = await this.store.get(this.path);
    if (stored && canWrite(this.owner, stored)) {
      this.storeEmitAndSend(data, true);
    } else if (response) this.storeEmitAndSend(data, true);
    else this.storeEmitAndSend(data);
  }
}

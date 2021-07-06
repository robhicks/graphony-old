import { uuid } from './utils/uuid';
import isBrowser from './utils/isBrowser';
import { deepEquals } from './utils/deepEquals';
import { isArray } from './utils/isArray';

const utc = () => Math.floor(new Date().getTime() / 1000);

const canRead = (currentUser, storedData) => currentUser === storedData.owner
  || storedData.readers.includes(currentUser)
  || storedData.readers.includes('all')
  || storedData.writers.includes(currentUser);

const canWrite = (currentUser, storedData) => currentUser === storedData.owner
  || storedData.writers.includes(currentUser);

const refRegX = new RegExp('^ref:');

export default class Node {
  constructor(path, ctx, readers = [], writers = []) {
    this.browser = isBrowser;
    this.server = !isBrowser;
    this.path = path;
    this.events = ctx.events;
    this.nodes = ctx.nodes;
    this.uid = uuid();
    this.gid = ctx.uuid;
    this.store = ctx.store;
    this.user = ctx.user;
    this.wsc = ctx.wsc;
    this.wss = ctx.wss;
    this.readers = readers;
    this.writers = writers;
    this.version = 0;
    this.nextPaths = new Set();
  }

  defaultVal(val) {
    return {
      value: val?.value || val,
      owner: val?.owner || this?.user.uid,
      path: this.path,
      readers: val?.readers || this.readers,
      updated: utc(),
      updatedBy: val?.updatedBy || this?.user.uid,
      writers: val?.writers || this.writers,
      // eslint-disable-next-line no-plusplus
      version: val?.version ? val.version + 1 : ++this.version,
    };
  }

  async storeEmitAndSend(data, publish = false) {
    this._value = data;
    this.store.put(this.path, data, true);
    if (isArray(data?.value)) {
      if (data.value.some((el) => refRegX.test(el))) {
        const v = data.value.map((el) => {
          const node = this.nodes.get(el);
          return node?.value;
        });
        this.events.emit(this.path, v);
      } else if (data.value.some((el) => el.includes('.'))) {
        const v = data.value.map((el) => {
          const node = this.nodes.get(el);
          return node?.value;
        });
        this.events.emit(this.path, v);
      }
    } else {
      this.events.emit(this.path, data.value);
    }
    if (publish) {
      this.wsc.publish({
        action: 'PUBLISH', data, gid: this.gid, path: this.path,
      });
    }
  }

  get value() {
    const current = this._value || this.defaultVal();

    if (current && canRead(this.user.uid, current)) {
      return current.value;
    }
    return null;
  }

  set value(val) {
    let publish = false;
    if (val?.action === 'DELETE') {
      this.store.del(this.path);
      this.events.emit(this.path, null);
      this.wsc.delete({ gid: this.gid, path: this.path });
    } else if (val?.action === 'LOAD_RESPONSE' || val?.action === 'PUBLISHED') {
      this.storeEmitAndSend(val, publish);
    } else if (!deepEquals(this._value, val)) {
      const data = this.defaultVal(val);
      publish = true;
      this.storeEmitAndSend(data, publish);
    }
  }
}

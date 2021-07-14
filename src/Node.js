import { uuid } from './utils/uuid';
import isBrowser from './utils/isBrowser';
import { deepEquals } from './utils/deepEquals';
import { isArray } from './utils/isArray';
import resolver from './utils/resolver';

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
    (async () => {
      try {
        const localVal = await this.store.get(this.path);
        if (localVal) this.value = { ...localVal, ...{ action: 'LOCAL_GET' } };
      } catch (error) {
        console.error('error', error);
      }
    })();
  }

  defaultVal(val) {
    const retVal = {
      ...val,
      ...{
        owner: val?.owner || this?.user.uid,
        readers: val?.readers || this.readers,
        updated: val?.updated || utc(),
        updatedBy: val?.updatedBy || this?.user.uid,
        writers: val?.writers || this.writers,
      },
    };
    if (val?.action !== 'LOAD_RESPONSE') {
      if (val.version) retVal.version = val.version + 1;
    }
    // console.log('retVal', retVal);
    return retVal;
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
      const d = { ...data, ...{ action: 'PUBLISH', gid: this.gid, path: this.path } };
      // console.log('d', d);
      this.wsc.publish(d);
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
    // console.log('val', val);
    const value = this.defaultVal(val);
    // value = resolver({ updated: this.updated, value: this._value, version: this.version }, value);
    const { action } = value;
    console.log('action', action);
    switch (action) {
    case 'DELETE':
      this.store.del(this.path);
      this.events.emit(this.path, null);
      this.wsc.delete({ gid: this.gid, path: this.path });
      break;
    case 'LOCAL_GET':
      this.storeEmitAndSend(value, false);
      break;
    case 'PUBLISHED': break;
    case 'PUT':
      this.storeEmitAndSend(value, true);
      break;
    case 'SERVER_GET':
      this.storeEmitAndSend(value, false);
      break;
    default: break;
    }
  }
}

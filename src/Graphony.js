import { EventEmitter } from './utils/EventEmitter';
import { Storage } from './utils/Storage';
import { uuid } from './utils/uuid';
import del from './methods/del';
import get from './methods/get';
import IdbKeyValStore from './utils/IdbKeyValStore';
import isBrowser from './utils/isBrowser';
import Nodes from './Nodes';
import once from './methods/once';
import on from './methods/on';
import push from './methods/push';
import put from './methods/put';
import set from './methods/set';
import User from './User';

export class Graphony {
  constructor(options = {}) {
    this.isBrowser = isBrowser;
    this.nodes = new Nodes();
    this.options = options;
    this.wsc = options.wsc;
    this.wss = options.wss;

    this.socket = options.socket;
    this.events = new EventEmitter({ singleton: true, socket: this.socket });

    if (this.wsc || this.isBrowser) {
      this.store = options.db ? new Storage(options.db) : new Storage(new IdbKeyValStore());
    } else if (this.wss) {
      this.store = this.wss.store;
    }

    this.user = new User(this);

    return this;
  }

  async getUuid() {
    if (this.uuid) return this.uuid;
    const u = await this.store.get('uuid');
    if (u) this.uuid = u;
    else this.uuid = uuid();

    return this.uuid;
  }

  async reset() {
    this.events.clear();
    this.nodes.clear();
    this.store.clear();
  }
}

Graphony.prototype.del = del;
Graphony.prototype.get = get;
Graphony.prototype.on = on;
Graphony.prototype.once = once;
Graphony.prototype.push = push;
Graphony.prototype.put = put;
Graphony.prototype.set = set;

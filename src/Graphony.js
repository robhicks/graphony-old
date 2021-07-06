import { EventEmitter } from './utils/EventEmitter';
import { uuid } from './utils/uuid';
import isBrowser from './utils/isBrowser';
import Nodes from './Nodes';

import del from './methods/del';
import get from './methods/get';
import once from './methods/once';
import on from './methods/on';
import push from './methods/push';
import put from './methods/put';
import set from './methods/set';

export class Graphony {
  constructor(options = {}) {
    this.filters = options.filters || new Map();
    this.isBrowser = isBrowser;
    this.nodes = new Nodes();
    this.uuid = uuid();
    this.events = new EventEmitter();
    this.store = options.store;

    return this;
  }

  get store() {
    return this._store;
  }

  set store(store) {
    this._store = store;
  }

  get uuid() {
    return this._uuid;
  }

  set uuid(val) {
    this._uuid = val;
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

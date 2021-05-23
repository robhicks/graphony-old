'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function argValidator(event, listener) {
  if (typeof event !== 'string') throw TypeError('event must be string');
  if (typeof listener !== 'function') throw TypeError('listener must be function');
}

const eventEmitterMap = new Map();

class EventEmitter {
  constructor(options = {}) {
    this.ctx = options.ctx;
    this.socket = options.socket;
    if (options.singleton) {
      if (eventEmitterMap.has('instance')) return eventEmitterMap.get('instance');
      eventEmitterMap.set('instance', this);
    }
    this.events = new Map();
  }

  clear() {
    this.events.clear();
  }

  emit(event, ...args) {
    const exists = this.events.has(event);
    if (exists) {
      this.events.get(event).forEach((listener) => {
        listener(...args);
      });
    }
  }

  eventSize(event) {
    return this.events.get(event).size;
  }

  off(event, listener) {
    argValidator(event, listener);
    if (this.events.has(event) && this.events.get(event).has(listener)) {
      this.events.get(event).delete(listener);
      if (this.events.get(event).size === 0) this.events.delete(event);
    }
  }

  on(event, listener) {
    argValidator(event, listener);
    if (!this.events.has(event)) this.events.set(event, new Set());
    if (!this.events.get(event).has(listener)) this.events.get(event).add(listener);
  }

  get size() {
    return this.events.size;
  }
}

function copy(obj = {}) {
  return JSON.parse(JSON.stringify(obj));
}

function isJson(str) {
  try {
    let json = JSON.parse(str);
    return json;
  } catch (e) {
    return false;
  }
}

class Storage {
  constructor(store) {
    this.store = store;
  }

  clear() {
    this.store.clear();
  }

  del(path) {
    return this.store.del(path);
  }

  async get(path) {
    return this.store.get(path);
  }

  put(path, value, overwrite = false) {
    const val = isJson(value) ? copy(value) : value;
    return this.store.put(path, val, overwrite);
  }
}

function uuid() {
  let d = new Date().getTime();
  const uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uid;
}

function del$1() {
  this.nodes.delete(this.currentPath);
  return this;
}

function deepEquals(a, b) {
  if (a === b) return true;

  const arrA = Array.isArray(a);
  const arrB = Array.isArray(b);
  let i;

  if (arrA && arrB) {
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) if (!deepEquals(a[i], b[i])) return false;
    return true;
  }

  if (arrA !== arrB) return false;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;

    const dateA = a instanceof Date;
    const dateB = b instanceof Date;
    if (dateA && dateB) return a.getTime() === b.getTime();
    if (dateA !== dateB) return false;

    const regexpA = a instanceof RegExp;
    const regexpB = b instanceof RegExp;
    if (regexpA && regexpB) return a.toString() === b.toString();
    if (regexpA !== regexpB) return false;

    for (i = 0; i < keys.length; i++) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = 0; i < keys.length; i++) if (!deepEquals(a[keys[i]], b[keys[i]])) return false;

    return true;
  }

  return false;
}

const isBrowser = typeof window !== 'undefined';

class Node {
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

function get$1(path = 'root') {
  this.previousPath = this.currentPath;
  if (/\./.test(path)) this.currentPath = path;
  else {
    if (path === 'root') this.currentPath = path;

    const idx = this.currentPath ? this.currentPath.lastIndexOf(path) : -1;

    if (idx !== -1) {
      this.currentPath = this.currentPath.substr(0, idx + path.length);
    } else {
      this.currentPath = `${this.currentPath || 'root'}.${path}`;
    }
  }
  const node = new Node(this.currentPath, this);
  this.nodes.add(this.currentPath, node);

  return this;
}

function promisifyRequest(request) {
    return new Promise((resolve, reject) => {
        // @ts-ignore - file size hacks
        request.oncomplete = request.onsuccess = () => resolve(request.result);
        // @ts-ignore - file size hacks
        request.onabort = request.onerror = () => reject(request.error);
    });
}
function createStore(dbName, storeName) {
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    const dbp = promisifyRequest(request);
    return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
    if (!defaultGetStoreFunc) {
        defaultGetStoreFunc = createStore('keyval-store', 'keyval');
    }
    return defaultGetStoreFunc;
}
/**
 * Get a value by its key.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function get(key, customStore = defaultGetStore()) {
    return customStore('readonly', (store) => promisifyRequest(store.get(key)));
}
/**
 * Set a value with a key.
 *
 * @param key
 * @param value
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function set$1(key, value, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.put(value, key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Delete a particular key from the store.
 *
 * @param key
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function del(key, customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.delete(key);
        return promisifyRequest(store.transaction);
    });
}
/**
 * Clear all values in the store.
 *
 * @param customStore Method to get a custom store. Use with caution (see the docs).
 */
function clear(customStore = defaultGetStore()) {
    return customStore('readwrite', (store) => {
        store.clear();
        return promisifyRequest(store.transaction);
    });
}

function isArray(candidate) {
  return Array.isArray(candidate);
}

function isObject(candidate, strict = true) {
  if (!candidate) return false;
  if (strict) return typeof candidate === 'object' && !isArray(candidate);
  return typeof candidate === 'object';
}

const defaultDbName$1 = 'GraphonyDB';
const defaultStoreName = 'GraphonyStore';

class IdbKeyValStore {
  constructor(dbName, storeName) {
    this.store = createStore(dbName || defaultDbName$1, storeName || defaultStoreName);
  }

  async clear() {
    return clear(this.store);
  }

  async del(key) {
    return del(key, this.store);
  }

  async get(key) {
    return get(key, this.store);
  }

  async put(key, data, overwrite = false) {
    if (overwrite) return this.set(key, data);
    const d = await this.get(key);
    if (deepEquals(d, data)) return;
    let dta;
    if (isArray(data) && isArray(d)) {
      dta = [...d, ...data];
    } else if (isObject(data) && isArray(d)) {
      dta = data;
    } else if (isObject(d) && isObject(data)) {
      dta = { ...d, ...data };
      this.set(key, { ...d, ...data });
    } else {
      dta = data;
    }

    return this.set(key, dta);
  }

  async set(key, data) {
    return set$1(key, data, this.store);
  }
}

class Nodes {
  constructor() {
    this.nodes = new Map();
  }

  add(path, val) {
    if (!this.nodes.has(path)) {
      this.nodes.set(path, val);
    }
  }

  clear() {
    this.nodes.clear();
  }

  delete(path) {
    this.nodes.delete(path);
  }

  get(path) {
    return this.nodes.get(path);
  }

  nodes() {
    return this.nodes;
  }

  size() {
    return this.nodes.size;
  }
}

function once(callback = Function) {
  const node = this.nodes.get(this.currentPath);
  (async (cb) => {
    try {
      let value = await node.getValue();
      if (isArray(value)) {
        if (this.filters.has(this.currentPath)) {
          value = this.filters.get(this.currentPath);
          this.filters.del(this.currentPath);
        } else {
          value = await Promise.all(value.map(async (v) => {
            const path = v.includes('root.') ? v : `${this.currentPath}.${v}`;
            const n = this.nodes.get(path);
            const vl = await n.getValue();
            return vl;
          }));
        }
      }
      return cb(value);
    } catch (err) {
      return err;
    }
  })(callback);

  return this;
}

function on(cb) {
  this.events.on(this.currentPath, cb);
  return this;
}

function push(val) {
  const node = this.nodes.get(this.currentPath);
  (async () => {
    try {
      const value = await node.getValue();
      if (!isArray(value)) throw Error('cannot push into non-array');
      const ref = `ref:${uuid()}`;
      const path = `${this.currentPath}.${ref}`;
      const newNode = new Node(path, this);
      this.nodes.add(path, newNode);
      await newNode.setValue(value);
      value.push(ref);
      return node.setValue(val);
    } catch (err) {
      return err;
    }
  })();
  return this;
}

function put(val) {
  const node = this.nodes.get(this.currentPath);
  (async () => {
    try {
      const value = await node.getValue();
      const nVal = copy(val);
      const v = { ...value, ...nVal };
      await node.setValue(v);
    } catch (err) {
      // eat it
    }
  })();

  return this;
}

function set(value) {
  const currentNode = this.nodes.get(this.currentPath);
  (async (val) => {
    try {
      if (isArray(val)) {
        await currentNode.setValue([]);
        const temp = [];
        val.forEach((v) => {
          const ref = `ref:${uuid()}`;
          const path = `${this.currentPath}.${ref}`;
          const newNode = new Node(path, this);
          this.nodes.add(path, newNode);
          newNode.setValue(v);
          temp.push(ref);
        });
        await currentNode.setValue(temp);
      } else {
        await currentNode.setValue(val);
      }
    } catch (err) {
      // eat it
    }
  })(value);
  return this;
}

class User {
  constructor(ctx) {
    this.authenticated = false;
    Object.assign(this, ctx);
    this.uid = uuid();
    this.jwt = null;
  }

  createAccount(username, password) {
    if (this.isBrowser && this.wsc) {
      this.wsc.send({ action: 'CREATE_ACCOUNT', data: { username, password, id: this.uid } });
    }
  }

  createProfile(data) {
    this.get()
      .get('users')
      .get(this.uid)
      .get('profile')
      .set(data);
  }

  deleteAccount() {
    this.get()
      .get('users')
      .get(this.uid)
      .set(null);
  }

  deleteProfile() {
    this.get()
      .get('users')
      .get(this.uid)
      .get('profile')
      .set(null);
  }

  login(username, password) {
    if (this.isBrowser && this.wsc) {
      this.wsc.send({ action: 'LOGIN', data: { username, password, id: this.uid } });
    }
  }

  logout() {
    if (this.isBrowser && this.wsc) {
      this.wsc.send({ action: 'LOGOUT', data: { id: this.uid } });
    }
  }
}

class Graphony {
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

Graphony.prototype.del = del$1;
Graphony.prototype.get = get$1;
Graphony.prototype.on = on;
Graphony.prototype.once = once;
Graphony.prototype.push = push;
Graphony.prototype.put = put;
Graphony.prototype.set = set;

// https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/
class WebSocketServer {
  constructor(options = {}) {
    this.autoRestartInterval = 1000;
    this.port = options.port;
    this.server = options.server;
    this.wss = options.wss;
    this.store = options.store;
    this.start();
  }

  start() {
    // eslint-disable-next-line
    console.log('waiting for wss server to load ...');
    try {
      this.server.listen(this.port);
      this.server.on('listening', () => console.log(`Websocket server listening on port ${this.port}`));
      this.server.on('upgrade', (req, socket, head) => {
        // do authentication here
      });
      this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          const { action, data } = JSON.parse(message);
          if (action === 'registerClient' && this.wss.clients.has(ws) && !ws.clientId) {
            Object.assign(ws, { clientId: data.clientId, paths: new Set() });
          }
        });
      });
      this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          const { action, path } = JSON.parse(message);
          if (action === 'registerNode' && this.wss.clients.has(ws)) {
            ws.paths.add(path);
          }
        });
      });
      this.wss.on('connection', (ws) => {
        ws.on('message', async (message) => {
          const { action, path } = JSON.parse(message);
          if (action === 'GET' && this.wss.clients.has(ws)) {
            const val = await this.store.get(path);
            if (val) {
              const payload = { action: 'RESPONSE', path, data: val };
              ws.send(JSON.stringify(payload));
            }
          }
        });
      });
      this.wss.on('connection', (ws) => {
        ws.on('message', (message) => {
          const { action, data, path } = JSON.parse(message);
          if (action === 'PUT') {
            this.store.put(path, data);
          }
          this.wss.clients.forEach((client) => {
            if (client !== ws && client.paths && client.paths.has(path)) {
              client.send(message);
            }
          });
        });
      });
    } catch (e) {
      // eslint-disable-next-line
      console.error('error starting:', e);
    }
  }
}

const defaultDbName = 'GraphonyDb';

class LevelKeyStore {
  constructor(level, dbName) {
    this.db = level(dbName || defaultDbName);
  }

  async clear() {
    return this.db.clear();
  }

  async del(key) {
    return this.dbdel(key);
  }

  async get(key) {
    try {
      const val = await this.db.get(key);
      return val;
    } catch (err) {
      return null;
    }
  }

  async put(key, data, overwrite = false) {
    if (overwrite) return this.set(key, data);
    const d = await this.get(key);
    if (deepEquals(d, data)) return;
    let dta;
    if (isArray(data) && isArray(d)) {
      dta = [...d, ...data];
    } else if (isObject(data) && isArray(d)) {
      dta = data;
    } else if (isObject(d) && isObject(data)) {
      dta = { ...d, ...data };
      this.set(key, { ...d, ...data });
    } else {
      dta = data;
    }

    return this.set(key, dta);
  }

  async set(key, data) {
    const str = JSON.stringify(data);
    return this.db.put(key, str);
  }
}

exports.Graphony = Graphony;
exports.LevelKeyStore = LevelKeyStore;
exports.WebSocketServer = WebSocketServer;

import {
  clear, createStore, del, get, set,
} from 'idb-keyval';
import { isObject } from './isObject';
import { isArray } from './isArray';
import { deepEquals } from './deepEquals';

const defaultDbName = 'GraphonyDB';
const defaultStoreName = 'GraphonyStore';

export class IdbKeyValStore {
  constructor(dbName, storeName) {
    this.store = createStore(dbName || defaultDbName, storeName || defaultStoreName);
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
    if (deepEquals(d, data)) return data;
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
    return set(key, data, this.store);
  }
}

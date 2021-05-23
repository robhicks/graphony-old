import { isObject } from './isObject';
import { isArray } from './isArray';
import { deepEquals } from './deepEquals';

const defaultDbName = 'GraphonyDb';

export class LevelKeyStore {
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

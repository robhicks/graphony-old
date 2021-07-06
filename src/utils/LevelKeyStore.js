/* eslint-disable no-console */

import { isObject } from './isObject';
import { isArray } from './isArray';

export class LevelKeyStore {
  constructor(level, location, options = {}) {
    this.level = level;
    this.location = location;
    this.options = options;
    this.connect();
  }

  async clear() {
    return this.db.clear();
  }

  connect() {
    try {
      this.db = this.level(this.location, this.options);
    } catch (error) {
      console.error('level connection error', error);
    }
  }

  async del(key) {
    return this.db.del(key);
  }

  async get(key) {
    try {
      const val = await this.db.get(key);
      return JSON.parse(val);
    } catch (err) {
      console.log('level get err', err);
      return null;
    }
  }

  async put(key, data, overwrite = false) {
    if (overwrite) return this.set(key, data);
    const d = await this.get(key);
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

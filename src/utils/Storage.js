import { copy } from './copy';
import { isJson } from './isJson';

export class Storage {
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

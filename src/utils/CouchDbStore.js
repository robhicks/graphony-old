import nano from 'nano';

export default class CouchDbStore {
  constructor(url) {
    this.nano = nano(url);
    this.connect();
  }

  clear() {}

  del() {}

  async get(key) {
    try {
      const val = await this.db.get(key);
      return val;
    } catch (err) {
      return null;
    }
  }

  put() {}

  set() {}

  async connect() {
    try {
      this.db = this.nano.db.use('graphony');
    } catch (error) {
      this.db = this.nano.db.create('graphony');
    }
  }
}

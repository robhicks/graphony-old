/* eslint-disable no-console */
const { MongoClient } = require('mongodb');

function isArray(candidate) {
  return Array.isArray(candidate);
}
function isObject(candidate, strict = true) {
  if (!candidate) return false;
  if (strict) return typeof candidate === 'object' && !isArray(candidate);
  return typeof candidate === 'object';
}

export class MongoDbStore {
  constructor(uri, options = { useUnifiedTopology: true }, name = 'GraphonyDB') {
    this.client = new MongoClient(uri, options);
    this.name = name;
    this.connect();
    this.colName = 'nodes';
  }

  async clear() {
    await this.db.dropCollection(this.name);
  }

  async connect() {
    if (!this.client.isConnected()) {
      await this.client.connect();
      this.db = this.client.db(this.name);
      await this.db.collection(this.colName).createIndex({ path: 1 }, { unique: true });
    }
  }

  async del(path) {
    await this.connect();
    await this.db.collection(this.colName).deleteOne({ path });
  }

  async disconnect() {
    await this.client.close();
  }

  async get(path) {
    await this.connect();
    return this.db.collection(this.colName).findOne({ path });
  }

  async put(path, data, overwrite = false) {
    await this.connect();
    if (overwrite) return this.db.collection(this.colName).replaceOne({ path }, { path, ...data });
    const d = await this.get(path);
    console.log('d', d);
    let dta;
    if (d) {
      if (isArray(data) && isArray(d)) {
        dta = [...d, ...data];
      } else if (isObject(data) && isArray(d)) {
        dta = data;
      } else if (isObject(d) && isObject(data)) {
        dta = { ...d, ...data };
      } else {
        dta = data;
      }
      console.log('dta', dta);
      return this.db.collection(this.colName).replaceOne({ path }, { path, ...dta });
    }
    return this.db.collection(this.colName).insertOne({ path, ...data });
  }

  async set(path, data) {
    await this.connect();
    const d = await this.get(path);
    if (d) return this.put(path, data, true);

    return this.db.collection(this.colName).insertOne({ path, ...data });
  }
}

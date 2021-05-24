module.exports = class CouchDbStore {
  constructor() {
    this.nano = require('nano')('http://localhost:5984');
    this.connect();
  }

  async connect() {
    try {
      this.db = await this.nano.db.use('graphony');
    } catch (error) {
      console.log('errors', errors);
    }
  }
};

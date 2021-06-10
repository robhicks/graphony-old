import { expect } from 'chai';
import {MongoDbStore} from '../src/utils/MongoDbStore'

const uri = 'mongodb://localhost:27017'

describe('MongoDbStore', () => {
  let store;

  before(async () => {
    store = new MongoDbStore(uri, { useUnifiedTopology: true });
  });
  
  after(() => {
    store.disconnect()
  });

  it('should have certain properties upon instantiation', () => {
    expect(store.connect).to.be.a('function');
    expect(store.del).to.be.a('function');
    expect(store.disconnect).to.be.a('function');
    expect(store.get).to.be.a('function');
    expect(store.put).to.be.a('function');
    expect(store.set).to.be.a('function');
    expect(store.name).to.equal('GraphonyDB');
  }); 

  it('should create a collection', async () => {
    await store.connect();
    expect(store.db).to.be.ok
  });

  describe('del()', async () => {
    it('should delete data from the collections', async () => {
      const path = 'root';
      const data = { firstName: 'rob', lastName: 'hicks' }
      await store.set(path, data);
      await store.del(path);
      const r = await store.get(path);
      expect(r).to.not.be.ok;
    });
  });

  describe('set()', () => {
    it('should store data in the collection', async () => {
      const path = 'root';
      const data = {firstName: 'rob', lastName: 'hicks'}
      await store.set(path, data);
      const resp = await store.get(path);
      expect(resp.path).to.equal('root');
      expect(resp.firstName).to.equal('rob');
      expect(resp.lastName).to.equal('hicks')
    });
  });

  describe('put()', () => {
    it('should act like a set if there is no stored data', async() => {
      const path = 'root';
      const data = { firstName: 'rob', lastName: 'hicks' }
      await store.del(path)
      await store.put(path, data);
      const r = await store.get(path);
      expect(r.path).to.equal('root');
      expect(r.firstName).to.equal('rob');
      expect(r.lastName).to.equal('hicks')
    });

    it.only('should update an array', async() => {
      const path = 'foobar';
      const data = [{ firstName: 'rob', lastName: 'hicks' }]
      const data1 = [{ firstName: 'glenda', lastName: 'hicks' }]
      await store.set(path, data);
      await store.put(path, data1);
    });
  });
});
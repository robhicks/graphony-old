import { GraphonyClient } from '../../src/GraphonyClient';
import baseUrl from '../../src/utils/baseUrl';

describe.only('GraphonyClient', () => {

  const url = baseUrl().replace('37367', '8081').replace('http', 'ws');
  console.log(`url`, url)
  let graphony;

  beforeEach(() => {
    graphony = new GraphonyClient({ url });
    window.graphony = graphony;
  });
  afterEach(async() => {
    // await graphony.reset();
  });

  it('when instantiated should have certain properties', () => {
    expect(graphony.del).to.be.an('function');
    expect(graphony.get).to.be.an('function');
    expect(graphony.on).to.be.an('function');
    expect(graphony.once).to.be.an('function');
    // expect(graphony.pop).to.be.an('function');
    // expect(graphony.put).to.be.an('function');
    expect(graphony.put).to.be.an('function');
    expect(graphony.set).to.be.an('function');
    // expect(graphony.shift).to.be.an('function');
    // expect(graphony.splice).to.be.an('function');
    // expect(graphony.unshift).to.be.an('function');
  });

  it('should get a node if it exists', () => {
    graphony.get();
    expect(graphony.nodes.get('root')).to.be.ok;
  });

  it('should get a Map of nodes', () => {
    graphony
      .get()
      .get('user')
      .get('rob');

    expect(graphony.nodes.size()).to.be.equal(3);
  });

  it('should connect to a server', () => {
    expect(graphony.wsc).to.exist;
  });

  it(`should set a node value`, () => {
    const obj = {name: 'rob'};
    graphony
      .get()
      .get('users')
      .get('rob')
      .once(val => {
        // console.log(`val`, val)
        expect(val).to.eql(obj)
      })
      .set(obj)
  });

  it.skip('should get the value stored in IndexedDB', async() => {
    const value = { name: 'tom' };
    await graphony.store.put('root.users.tom', {
      owner: "cfea0535-6e76-4e63-ab0e-f552a9ff9157",
      path: "root.users.tom",
      readers: [],
      updated: 1623814377,
      updatedBy: "cfea0535-6e76-4e63-ab0e-f552a9ff9157",
      value,
      version: 1,
      writers: []
    }, true)
    graphony
      .get()
      .get('users')
      .get('tom')
      .on(val => {
        // console.log(`val`, val)
        expect(val).to.eql(value)
      })
  });

  describe('Client/Server Interactions', () => {

    it.only('should get data from the server', (done) => {
      graphony.get().get('users').get('timothy').once(val => {
        // console.log(`val`, val)
        expect(val.name).to.equal('timothy')
        done()
      })
     
    });

    it('should PUT data to the server', () => {
      const obj = { name: 'rob' };
      graphony
        .get()
        .get('users')
        .get('rob')
        .once(val => {
          // console.log(`val`, val)
          expect(val).to.be.null;
        })
        .del()
        .once(val => {
          // console.log(`val`, val)
          expect(val.name).to.equal('rob')
        })
        .set(obj)
    });
  });
});

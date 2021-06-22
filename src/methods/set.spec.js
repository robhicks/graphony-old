import { Graphony } from '../Graphony.js';
import { WebSocketClient } from '../WebSocketClient'

describe('set()', () => {
  let graphony;

  beforeEach(async () => {
    const wsc = new WebSocketClient('ws://localhost:8081')
    graphony = new Graphony({wsc});
  });
  afterEach(async () => {
    // await graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.set).to.exist;
  });

  it('should set a simple object', () => {
    const obj = { name: 'foo' };
    graphony
    .get()
    .once((val) => {
      // console.log(`val`, val)
      expect(val).to.eql(obj);
    })
    .set(obj)
  });

  it('should set an empty array', () => {
    const obj = [];
    graphony
      .get()
      .once((val) => {
        // console.log(`val`, val)
        expect(val).to.be.eql(obj);
      })
      .set(obj)
    });
    
    it('should add a deeply nested object', () => {
      const obj = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };
      graphony
      .get()
      .once((val) => {
        // console.log(`val`, val)
        expect(val).to.be.eql(obj);
      })
      .set(obj)
    });
    
    it('should set an array with items', () => {
      const obj = [{ name: 'foo' }, { name: 'bar' }];
      graphony
      .get()
      .once((val) => {
        // console.log(`val`, val)
        expect(val).to.be.eql(obj);
      })
      .set(obj)
  });
});

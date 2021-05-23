import { Graphony } from '../Graphony.js';

describe('set()', () => {
  let graphony;

  beforeEach(async () => {
    graphony = new Graphony({ wsc: { Client: WebSocket, url: 'ws://localhost:8081' } });
  });
  afterEach(async () => {
    await graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.set).to.exist;
  });

  it('should set a simple object', () => {
    const obj = { name: 'foo' };
    graphony.get().set(obj).once((val) => {
      expect(val).to.eql(obj);
    });
  });

  it('should set an empty array', () => {
    const obj = [];
    graphony.get().set(obj).once((val) => {
      expect(val).to.be.eql(obj);
    });
  });

  it('should add a deeply nested object', () => {
    const obj = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };
    graphony.get().set(obj).once((val) => {
      expect(val).to.be.eql(obj);
    });
  });

  it('should set an array with items', () => {
    const obj = [{ name: 'foo' }, { name: 'bar' }];
    graphony.get().set(obj).once((val) => {
      expect(val).to.be.eql(obj);
    });
  });
});

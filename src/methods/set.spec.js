import { Graphony } from '../Graphony.js';

describe('set()', () => {
  let as;

  beforeEach(async () => {
    as = new Graphony({ wsc: { Client: WebSocket, url: 'ws://localhost:8081' } });
  });
  afterEach(async () => {
    await as.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(as.set).to.exist;
  });

  it('should set a simple object', () => {
    const obj = { name: 'foo' };
    as.get().set(obj).once((val) => {
      expect(val).to.eql(obj);
    });
  });

  it('should set an empty array', () => {
    const obj = [];
    as.get().set(obj).once((val) => {
      expect(val).to.be.eql(obj);
    });
  });

  it('should add a deeply nested object', () => {
    const obj = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };
    as.get().set(obj).once((val) => {
      expect(val).to.be.eql(obj);
    });
  });

  it('should set an array with items', () => {
    const obj = [{ name: 'foo' }, { name: 'bar' }];
    as.get().set(obj).once((val) => {
      expect(val).to.be.eql(obj);
    });
  });
});

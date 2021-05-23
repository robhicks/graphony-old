import { Graphony } from '../Graphony';

describe('put()', () => {
  let graphony;
  const sObject = { name: 'foo' };
  const nObject = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };

  beforeEach(() => {
    graphony = new Graphony();
  });
  afterEach(() => {
    graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.put).to.exist;
  });

  it('should patch an object', () => {
    const set = { name: 'foo' };
    const put = { location: 'bar' };
    const obj = { name: 'foo', location: 'bar' };
    graphony
      .get()
      .set(set)
      .put(put)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should patch an object in a deeply nested node', () => {
    const set = { name: 'foo' };
    const put = { location: 'bar' };
    const obj = { name: 'foo', location: 'bar' };
    graphony
      .get()
      .get('users')
      .get('rob')
      .set(set)
      .put(put)
      .once((val) => expect(val).to.be.eql(obj));
  });
});

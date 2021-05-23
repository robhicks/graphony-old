import { Graphony } from '../Graphony';

describe('put()', () => {
  let as;
  const sObject = { name: 'foo' };
  const nObject = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };

  beforeEach(() => {
    as = new Graphony();
  });
  afterEach(() => {
    as.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(as.put).to.exist;
  });

  it('should patch an object', () => {
    const set = { name: 'foo' };
    const put = { location: 'bar' };
    const obj = { name: 'foo', location: 'bar' };
    as
      .get()
      .set(set)
      .put(put)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should patch an object in a deeply nested node', () => {
    const set = { name: 'foo' };
    const put = { location: 'bar' };
    const obj = { name: 'foo', location: 'bar' };
    as
      .get()
      .get('users')
      .get('rob')
      .set(set)
      .put(put)
      .once((val) => expect(val).to.be.eql(obj));
  });
});

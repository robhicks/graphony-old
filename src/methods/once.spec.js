import { Graphony } from '../Graphony';

describe('once()', () => {
  let as;

  beforeEach(() => {
    as = new Graphony();
  });
  afterEach(async () => {
    await as.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(as.once).to.exist;
  });

  it('should get the value of an object stored at the root', () => {
    const obj = { name: 'foo' };
    as
      .get()
      .set(obj)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should get the value of deeply stored object', () => {
    const obj = { name: 'foo' };
    as
      .get('users')
      .get('rob')
      .set(obj)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should get the value of an object stored at the root', () => {
    const obj = { name: 'foo', location: 'bar' };
    as
      .get()
      .set(obj)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should get the value of a deeply nested object', () => {
    const obj = { name: 'foo', location: 'bar' };
    as
      .get('users')
      .get('rob')
      .set(obj)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should get the value of an object stored by reference', () => {
    const obj = { name: 'rob' };
    as
      .get()
      .del()
      .get('rob')
      .del()
      .set(obj)
      .get()
      .get('users')
      .set([])
      .push('root.rob')
      .once((val) => expect(val).to.be.eql([obj]));
  });
});

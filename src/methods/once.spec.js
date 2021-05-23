import { Graphony } from '../Graphony';

describe('once()', () => {
  let graphony;

  beforeEach(() => {
    graphony = new Graphony();
  });
  afterEach(async () => {
    await graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.once).to.exist;
  });

  it('should get the value of an object stored at the root', () => {
    const obj = { name: 'foo' };
    graphony
      .get()
      .set(obj)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should get the value of deeply stored object', () => {
    const obj = { name: 'foo' };
    graphony
      .get('users')
      .get('rob')
      .set(obj)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should get the value of an object stored at the root', () => {
    const obj = { name: 'foo', location: 'bar' };
    graphony
      .get()
      .set(obj)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should get the value of a deeply nested object', () => {
    const obj = { name: 'foo', location: 'bar' };
    graphony
      .get('users')
      .get('rob')
      .set(obj)
      .once((val) => expect(val).to.be.eql(obj));
  });

  it('should get the value of an object stored by reference', () => {
    const obj = { name: 'rob' };
    graphony
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

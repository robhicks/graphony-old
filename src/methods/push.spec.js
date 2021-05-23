import { Graphony } from '../Graphony';

describe('push()', () => {
  let as;
  beforeEach(() => {
    as = new Graphony();
  });
  afterEach(() => {
    as.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(as.push).to.exist;
  });

  it('should add a simple object to an array', () => {
    const obj = { name: 'foo' };
    as.get().set([]).push(obj).once((val) => {
      expect(val).to.be.eql([obj]);
    });
  });

  it('should add an empty array', () => {
    const obj = [];
    as.get().set(obj).push(obj);
    as.get().once((val) => expect(val).to.be.eql([obj]));
  });

  it('should add a deeply nested object', () => {
    const obj = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };
    as.get().get('foo').get('bar').set([])
      .push(obj)
      .once((val) => expect(val).to.be.eql([obj]));
  });

  it('should add items to an array', () => {
    const foo = { name: 'foo' };
    const bar = { name: 'bar' };
    as.get().set([]).push(foo).push(bar)
      .once((val) => expect(val).to.be.eql([foo, bar]));
  });

  it('should add an object to an array by reference', () => {
    const rob = {
      givenname: 'rob',
      surnname: 'hicks',
    };

    as.get().get('rob').set(rob);
    as.get().get('users').set([]).push('root.rob')
      .once((val) => expect(val).to.be.eql([rob]));
  });
});

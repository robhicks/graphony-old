import { Graphony } from '../Graphony';

describe('push()', () => {
  let graphony;
  beforeEach(() => {
    graphony = new Graphony();
  });
  afterEach(() => {
    graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.push).to.exist;
  });

  it('should add a simple object to an array', () => {
    const obj = { name: 'foo' };
    graphony.get().set([]).push(obj).once((val) => {
      expect(val).to.be.eql([obj]);
    });
  });

  it('should add an empty array', () => {
    const obj = [];
    graphony.get().set(obj).push(obj);
    graphony.get().once((val) => expect(val).to.be.eql([obj]));
  });

  it('should add a deeply nested object', () => {
    const obj = { name: 'foo', address: { city: 'bar', state: 'baz', region: { name: 'south america' } } };
    graphony.get().get('foo').get('bar').set([])
      .push(obj)
      .once((val) => expect(val).to.be.eql([obj]));
  });

  it('should add items to an array', () => {
    const foo = { name: 'foo' };
    const bar = { name: 'bar' };
    graphony.get().set([]).push(foo).push(bar)
      .once((val) => expect(val).to.be.eql([foo, bar]));
  });

  it('should add an object to an array by reference', () => {
    const rob = {
      givenname: 'rob',
      surnname: 'hicks',
    };

    graphony.get().get('rob').set(rob);
    graphony.get().get('users').set([]).push(rob)
      .once((val) => expect(val).to.be.eql([rob]));
  });
});

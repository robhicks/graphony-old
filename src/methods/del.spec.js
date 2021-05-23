import { Graphony } from '../Graphony';

describe('del()', () => {
  let as;

  beforeEach(() => {
    as = new Graphony();
  });

  afterEach(() => {
    as.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(as.del).to.exist;
  });

  it('should delete an object stored at the root of the state manager', () => {
    as.get().set({ name: 'foo', location: 'bar' }).del().once((val) => expect(val).to.be.null);
  });

  it('should delete an object stored deeply nested ', () => {
    as
      .get()
      .get('users')
      .get('joe')
      .set({ name: 'foo', location: 'bar' })
      .del()
      .once((val) => expect(val).to.be.null);
  });

  it('should delete an array stored at the root of the db', () => {
    as
      .get()
      .set([{ name: 'foo', location: 'bar' }])
      .del()
      .once((val) => expect(val).to.be.null);
  });

  it('should delete an array stored deeply in the db', () => {
    as
      .get()
      .get('users')
      .get('joe')
      .set([{ name: 'foo', location: 'bar' }])
      .del()
      .once((val) => expect(val).to.be.null);
  });
});

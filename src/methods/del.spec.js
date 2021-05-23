import { Graphony } from '../Graphony';

describe('del()', () => {
  let graphony;

  beforeEach(() => {
    graphony = new Graphony();
  });

  afterEach(() => {
    graphony.reset();
  });

  it('should be created when Graphony is instantiated', () => {
    expect(graphony.del).to.exist;
  });

  it('should delete an object stored at the root of the state manager', () => {
    graphony.get().set({ name: 'foo', location: 'bar' }).del().once((val) => expect(val).to.be.null);
  });

  it('should delete an object stored deeply nested ', () => {
    graphony
      .get()
      .get('users')
      .get('joe')
      .set({ name: 'foo', location: 'bar' })
      .del()
      .once((val) => expect(val).to.be.null);
  });

  it('should delete an array stored at the root of the db', () => {
    graphony
      .get()
      .set([{ name: 'foo', location: 'bar' }])
      .del()
      .once((val) => expect(val).to.be.null);
  });

  it('should delete an array stored deeply in the db', () => {
    graphony
      .get()
      .get('users')
      .get('joe')
      .set([{ name: 'foo', location: 'bar' }])
      .del()
      .once((val) => expect(val).to.be.null);
  });
});

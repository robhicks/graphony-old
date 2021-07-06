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

  it('should delete an object stored at the root', () => {
    graphony.get().set({ name: 'foo', location: 'bar' }).del().once((val) => expect(val).to.be.null);
  });

  it('should delete an object stored deeply nested ', () => {
    graphony
      .get()
      .get('users')
      .get('joe')
      .set({ name: 'foo', location: 'bar' })
      .once((val) => {
        // console.log(`val`, val)
        expect(val).to.be.null
      })
      .del()
  });

  it('should delete an array stored at the root', () => {
    graphony
      .get()
      .set([{ name: 'foo', location: 'bar' }])
      .once((val) => {
        // console.log(`val`, val)
        expect(val).to.be.null
      })
      .del()
  });

  it('should delete an array stored deeply', () => {
    graphony
      .get()
      .get('users')
      .get('joe')
      .set([{ name: 'foo', location: 'bar' }])
      .once((val) => {
        // console.log(`val`, val)
        expect(val).to.be.null
      })
      .del()
  });
});

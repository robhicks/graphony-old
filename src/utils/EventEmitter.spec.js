import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  let events;

  beforeEach(() => {
    events = new EventEmitter();
  });

  afterEach(() => {
    events.clear();
  });

  it('should have certain properties when instantiated', () => {
    expect(events).to.be.instanceof(EventEmitter);
    expect(events.events).to.be.instanceof(Map);
    expect(events.clear).to.be.a('function');
    expect(events.emit).to.be.a('function');
    expect(events.off).to.be.a('function');
    expect(events.on).to.be.a('function');
    expect(events.eventSize).to.be.a('function');
    expect(events.size).to.exist;
  });

  it('should register a listener', () => {
    const cb = () => {};
    expect(events.size).to.be.equal(0);
    events.on('foo', cb);
    expect(events.size).to.be.equal(1);
    events.off('foo', cb);
    expect(events.size).to.be.equal(0);
  });

  it('should register a listener once', () => {
    const cb = () => {};
    expect(events.size).to.be.equal(0);
    events.on('foo', cb);
    expect(events.size).to.be.equal(1);
  });

  it('should create different instances', () => {
    const events1 = new EventEmitter();
    expect(events).to.not.be.equal(events1);
  });

  it('should not create duplicate event listeners', () => {
    const cb = () => {};

    events.on('foo', cb);
    expect(events.eventSize('foo')).to.be.equal(1);
    events.on('foo', cb);
    expect(events.eventSize('foo')).to.be.equal(1);
  });

  it('should add multiple event listeners for a path', () => {
    const cb = () => {};
    const cb1 = () => {};

    events.on('foo', cb);
    expect(events.eventSize('foo')).to.be.equal(1);
    events.on('foo', cb1);
    expect(events.eventSize('foo')).to.be.equal(2);
  });

  it('should remove the events channel when the last listener is removed', () => {
    const cb = () => {};
    const cb1 = () => {};
    events.on('foo', cb);
    events.on('foo', cb1);
    expect(events.size).to.be.equal(1);
    events.off('foo', cb);
    events.off('foo', cb1);
    expect(events.events.foo).to.be.undefined;
  });
});

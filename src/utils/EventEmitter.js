function argValidator(event, listener) {
  if (typeof event !== 'string') throw TypeError('event must be string');
  if (typeof listener !== 'function') throw TypeError('listener must be function');
}

const eventEmitterMap = new Map();

export class EventEmitter {
  constructor(options = {}) {
    this.ctx = options.ctx;
    this.socket = options.socket;
    if (options.singleton) {
      if (eventEmitterMap.has('instance')) return eventEmitterMap.get('instance');
      eventEmitterMap.set('instance', this);
    }
    this.events = new Map();
  }

  clear() {
    this.events.clear();
  }

  emit(event, ...args) {
    const exists = this.events.has(event);
    if (exists) {
      this.events.get(event).forEach((listener) => {
        listener(...args);
      });
    }
  }

  eventSize(event) {
    return this.events.get(event).size;
  }

  off(event, listener) {
    argValidator(event, listener);
    if (this.events.has(event) && this.events.get(event).has(listener)) {
      this.events.get(event).delete(listener);
      if (this.events.get(event).size === 0) this.events.delete(event);
    }
  }

  on(event, listener) {
    argValidator(event, listener);
    if (!this.events.has(event)) this.events.set(event, new Set());
    if (!this.events.get(event).has(listener)) this.events.get(event).add(listener);
  }

  get size() {
    return this.events.size;
  }
}

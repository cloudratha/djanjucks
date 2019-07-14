import globals from 'nunjucks/src/globals';

class Cycler {
  constructor(items) {
    this.items = items;
    this.index = -1;
    this.current = null;
  }

  silence(silent = false) {
    this.silent = silent;
  }

  next() {
    this.index += 1;

    if (this.index >= this.items.length) {
      this.index = 0;
    }

    this.current = this.items[this.index];
    return this.current;
  }

  reset() {
    this.index = -1;
    this.current = null;
  }

  toString() {
    return this.current;
  }
}

export default () => {
  return {
    ...globals(),
    cycler: function() {
      return new Cycler(Array.prototype.slice.call(arguments));
    }
  };
};

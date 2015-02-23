class LocalStorageShim {
  constructor() {
    this.store = {};
  }
  
  getItem(key) {
    return this.store[key];
  }
  
  setItem(key,val) {
    this.store[key] = val;
  }
  
  clear() {
    this.store = {};
  }
}

let instance;

module.exports = instance || (instance = new LocalStorageShim());
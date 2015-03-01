const Promise = require('es6-promise').Promise;

class Dispatcher {
  constructor() {
    this._callbacks = [];
    this._promises = [];
  }
  
  /**
   * Register a Store's callback so that it may be invoked by an action.
   * @param {function} callback The callback to be registered.
   * @return {number} The index of the callback within the _callbacks array.
   */
  register(callback) {
    this._callbacks.push(callback);
    return this._callbacks.length - 1; // index
  }
  
  /**
   * dispatch
   * @param  {object} payload The data from the action.
   */
  dispatch(payload) {
    // First create array of promises for callbacks to reference.
    var resolves = [];
    var rejects = [];
    this._promises = this._callbacks.map(function(_, i) {
      return new Promise(function(resolve, reject) {
        resolves[i] = resolve;
        rejects[i] = reject;
      });
    });
    // Dispatch to callbacks and resolve/reject promises.
    this._callbacks.forEach(function(callback, i) {
      // Callback can return an obj, to resolve, or a promise, to chain.
      // See waitFor() for why this might be useful.
      Promise.resolve(callback(payload)).then(function() {
        resolves[i](payload);
      }, function() {
        rejects[i](new Error('Dispatcher callback unsuccessful'));
      });
    });
    this._promises = [];
  }
}

module.exports = new Dispatcher;
if(typeof quark !== 'object')
  window.quark = require('./quark/shim');

if(quark.isShim)
  quark.debug = true; // enable for right-click web inspector

require('./quark/ui');
require('./quark/prefs');
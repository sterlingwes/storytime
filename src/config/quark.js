if(typeof quark !== 'object')
  window.quark = require('./quark/shim');
  
quark.debug = true; // enable for right-click web inspector

require('./quark/ui');
require('./quark/prefs');
const noop = function(){};

module.exports = [
  'addKeyboardShortcut',
  'setupPreferences',
  'openPreferences',
  'setMenubarIcon',
  'setMenubarHighlightedIcon',
  'setLabel',
  'openPopup',
  'closePopup',
  'on',
  'emit',
  'pin',
  'unpin',
  'checkUpdate',
  'quit'
].reduce((m,k) => {
  m[k] = noop;
  return m;
}, {});
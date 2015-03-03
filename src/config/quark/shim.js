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
  'checkUpdate'
].reduce((m,k) => {
  m[k] = noop;
  return m;
}, {});
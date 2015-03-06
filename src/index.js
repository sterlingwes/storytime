require('./config/quark');
require('./styles/base.styl');

import React from "react";
import Router from "react-router";
import Routes from "./app";

Router.run(Routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('render-spot'));
});

document.addEventListener('keydown', function(e) {
  // add listener to refocus cursor in search input on CMD + L combo
  if(e.metaKey && e.keyCode == 76) {
    var input = document.getElementById('searchInput');
    if(input) input.focus();
  }
  // add listener to close panel on ESC regardless of whether input is focused
  else if(e.keyCode == 27) {
    quark.closePopup();
  }
});
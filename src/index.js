require('./config/quark');
require('./styles/base.styl');

import React from "react"
import Router from "react-router"
import TransitionGroup from "react/lib/ReactCSSTransitionGroup"

const { Route, DefaultRoute, RouteHandler, Link } = Router
    // components
    , { SearchBar, StoryList, StoryDetail, Stats, StatsDay } = require('./components/index')
  ;

var App = React.createClass({
  
  mixins: [ Router.State ],
  
  render() {
    var routeName = this.getRoutes().reverse()[0].name;
    
    return (
      <div className="storytime">
        <TransitionGroup component="div" transitionName="stpane">
          <RouteHandler key={routeName} />
        </TransitionGroup>
      </div>
    );
  }
});

const Routes = (
  <Route handler={App} path="/">
    <DefaultRoute handler={StoryList} />
    <Route handler={StoryDetail} path="/story/:id" name="detail" />
    <Route handler={Stats} path="/stats" name="stats" />
    <Route handler={StatsDay} path="/stats/:month/:day" name="statsday" />
  </Route>
);

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
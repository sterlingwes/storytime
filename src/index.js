require('./config/quark');
require('./styles/base.styl');

const React = require('react')
    , Router = require('react-router')
    , { Route, DefaultRoute, RouteHandler, Link } = Router
    , TransitionGroup = require('react/lib/ReactCSSTransitionGroup')
    
    // components
    , { SearchBar, StoryList } = require('./components/index')
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
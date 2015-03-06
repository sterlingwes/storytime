import React from "react";
import Router from "react-router";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";

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

module.exports = Routes;
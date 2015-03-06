import React from 'react';

let { func } = React.PropTypes;

module.exports = (Component, props, stubs) => {
  return React.createClass({
    childContextTypes: {
      makePath: func,
      makeHref: func,
      transitionTo: func,
      replaceWith: func,
      goBack: func,
      getCurrentPath: func,
      getCurrentRoutes: func,
      getCurrentPathname: func,
      getCurrentParams: func,
      getCurrentQuery: func,
      getParams: func,
      isActive: func,
    },

    getChildContext () {
      return Object.assign({
        makePath () {},
        makeHref () {},
        transitionTo () {},
        replaceWith () {},
        goBack () {},
        getCurrentPath () {},
        getCurrentRoutes () {},
        getCurrentPathname () {},
        getCurrentParams () {},
        getCurrentQuery () {},
        getParams () {},
        isActive () {},
      }, stubs);
    },

    render () {
      return <Component {...props} />
    }
  });
};
import React from "react";
import StoryDetailSesssion from "./storysession.js";

const cx = React.addons.classSet
    , store = require('../data/index');

module.exports = React.createClass({
  
  getDefaultProps() {
    return {
      isTiming: false,
      hours: 0
    };
  },
  
  render() {
    let classes = {
      'st-storysession': true
    };
    
    return (
      <span className={cx(classes)}>
        { this.props.hours }
      </span>
    );
  }
});
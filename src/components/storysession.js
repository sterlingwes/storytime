import React from "react";
import StoryDetailSesssion from "./storysession.js";
import moment from "moment";

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
      'st-storysession': true,
      'st-storysession-active': this.props.isTiming
    };
    
    let dayLabel = moment(this.props.day).format('M/DD')
      , hours = Math.round(this.props.hours * 100) / 100;
    
    return (
      <li className={cx(classes)}>
        <span className="st-storyday">{ dayLabel }</span>
        <span className="st-storydayhours">{ hours }</span>
      </li>
    );
  }
});
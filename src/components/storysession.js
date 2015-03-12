import React from "react";
import StoryDetailSesssion from "./storysession.js";
import Actions from '../data/actions';
import moment from "moment";

const cx = React.addons.classSet
    , store = require('../data/index')
    , MINS_10 = 600000;

module.exports = React.createClass({
  
  getDefaultProps() {
    return {
      isTiming: false,
      hours: 0,
      story: {},
      day: 0
    };
  },
  
  offsetTime(e) {
    let day = moment(this.props.day);
    quark.showMenu({
      items: [
        {
          label: "Add 10mins.",
          click: function() {
            Actions.offsetTime(this.props.story.id, day, MINS_10);
          }.bind(this)
        },
        {
          label: "Subtract 10mins.",
          click: function() {
            Actions.offsetTime(this.props.story.id, day, -MINS_10);
          }.bind(this)
        }
      ],
      x: e.target.offsetLeft,
      y: e.target.offsetTop
    });
  },
  
  render() {
    let classes = {
      'st-storysession': true,
      'st-storysession-active': this.props.isTiming
    };
    
    let dayLabel = moment(this.props.day).format('M/DD')
      , hours = Math.round(this.props.hours * 100) / 100;
    
    return (
      <li className={cx(classes)} onClick={this.offsetTime}>
        <span className="st-storyday">{ dayLabel }</span>
        <span className="st-storydayhours">{ hours }</span>
      </li>
    );
  }
});
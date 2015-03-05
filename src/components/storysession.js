import React from "react";
import StoryDetailSesssion from "./storysession.js";
import Actions from '../data/actions';
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
  
  offsetTime(e) {
    quark.pin();
    alert('Options for editing time are coming soon.');
    quark.unpin();
    return;
    
    quark.showMenu({
      items: [
        {
          label: "Add 10mins.",
          click: function() {

          }.bind(this)
        },
        {
          label: "Subtract 10mins.",
          click: function() {

          }.bind(this)
        }
      ],
      x: 50,
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
      <li className={cx(classes)} onClick={this.offsetTime.bind(this,this.props.id)}>
        <span className="st-storyday">{ dayLabel }</span>
        <span className="st-storydayhours">{ hours }</span>
      </li>
    );
  }
});
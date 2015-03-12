import React from "react";
import Router from "react-router";
import Calendar from "./calendar";
import moment from "moment";

const cx = React.addons.classSet
    , store = require('../data/index');

module.exports = React.createClass({
  
  mixins: [ Router.State, Router.Navigation ],
  
  getState() {
    return {
      hourData: store.getByDate()
    };
  },
  
  getInitialState() {
    return this.getState();
  },
  
  getDefaultProps() {
    return {
    };
  },
  
  backHome() {
    this.goBack();
  },
  
  onDaySelected(day) {
    let dt = day.date;
    this.transitionTo('statsday', { month: dt.month(), day: dt.date() });
  },
  
  onMonthChange(month) {
    // could do something?
  },
  
  render() {
    let classes = {
      'st-stats': true,
      'st-child-pane': true
    };
    
    return (
      <div className={cx(classes)}>
        <Calendar className="st-calendar"
          onSelection={this.onDaySelected}
          onChange={this.onMonthChange}
          onClose={this.backHome}
          data={this.state.hourData} />
      </div>
    );
  }
});
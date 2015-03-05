import React from "react";
import Router from "react-router";

const cx = React.addons.classSet
    , store = require('../data/index');

module.exports = React.createClass({
  
  mixins: [ Router.State, Router.Navigation ],
  
  getDefaultProps() {
    return {
    };
  },
  
  getHours() {
    let params = this.getParams()
      , data = store.getByDate();
    
    let hours = store.getByDate(params.month, params.day) || [];
    console.log(hours);
    return hours;
  },
  
  getInitialState() {
    return {
      hours: this.getHours()
    };
  },
  
  componentDidMount() {
    this.refs.keyInput.getDOMNode().focus();
  },
  
  key(e) {
    switch(e.keyCode) {
      case 37:
        this.headingBack = true;
        this.goBack();
        return e.preventDefault();
    }
  },
  
  refocus() {
    if(this.headingBack) return;
    this.refs.keyInput.getDOMNode().focus();
  },
  
  consolidateSessions() {
    if(!this.state || !this.state.hours) return [];
    return this.state.hours.map(storyHours => {
      return <li>{ storyHours.hours } - { storyHours.project } { storyHours.name }</li>;
    });
  },
  
  render() {
    let classes = {
      'st-storydetail': true
    };
    
    let params = this.getParams()
      , sessionList
      , sessions = this.consolidateSessions();
      
    if(sessions.length){
      sessionList = (
        <ul className="st-detail-hours">
          { sessions }
        </ul>
      );
    }
    else sessionList = <div className="st-detail-none">No time tracked, yet!</div>;
    
    return (
      <div className={cx(classes)}>
        <div className="st-detail-header">
          <span className="st-detail-project">Day Stats</span>
          <span className="st-detail-name">Day, 2015</span>
        </div>
        { sessionList }
        <input className="st-detail-input"
          ref="keyInput"
          onKeyDown={this.key}
          onBlur={this.refocus} />
        <div className="st-detail-footer">
          Stories with less than 0.01 hours are ignored.
        </div>
      </div>
    );
  }
});
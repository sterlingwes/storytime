import React from "react";
import Router from "react-router";
import StoryDetailSession from "./storysession";

const cx = React.addons.classSet
    , store = require('../data/index');

module.exports = React.createClass({
  
  mixins: [ Router.State, Router.Navigation ],
  
  getDefaultProps() {
    return {
    };
  },
  
  componentDidMount() {
    this.refs.keyInput.getDOMNode().focus();
  },
  
  key(e) {
    switch(e.keyCode) {
      case 37:
        this.headingBack = true;
        this.transitionTo('/');
        return e.preventDefault();
    }
  },
  
  refocus() {
    if(this.headingBack) return;
    this.refs.keyInput.getDOMNode().focus();
  },
  
  consolidateSessions(story) {
    let days = story.consolidateTime();
    return Object.keys(days).sort().reverse().map(day => {
      let dayMeta = days[day];
      return (
        <StoryDetailSession key={day}
          day={parseInt(day)}
          hours={dayMeta.hours}
          isTiming={dayMeta.isOpen} />
      );
    });
  },
  
  render() {
    let classes = {
      'st-storydetail': true
    };
    
    let params = this.getParams()
      , story = store.getById(params.id)
      , sessionList
      , sessions = this.consolidateSessions(story);
      
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
          <span className="st-detail-project">{ story.get('project') }</span>
          <span className="st-detail-name">{ story.get('name') }</span>
        </div>
        { sessionList }
        <input className="st-detail-input"
          ref="keyInput"
          onKeyDown={this.key}
          onBlur={this.refocus} />
        <div className="st-detail-footer">
          Days with less than 0.01 hours are ignored.
        </div>
      </div>
    );
  }
});
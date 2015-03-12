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
  
  getInitialState() {
    return this.getState();
  },
  
  getState() {
    let params = this.getParams();
    return {
      story: store.getById(params.id)
    };
  },
  
  componentDidMount() {
    this.refs.keyInput.getDOMNode().focus();
    store.addChangeListener(this.onModelChange);
  },
  
  componentWillUnmount() {
    store.removeChangeListener(this.onModelChange);
  },
  
  //
  // EVENT HANDLERS ============================================================
  //
  
  onModelChange(payload) {
    this.setState(this.getState(), ()=> {
      console.log('onModelChange', arguments[0], this.state);
    });
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
    if(!'consolidateTime' in story) return [];
    let days = story.consolidateTime();
    return Object.keys(days).sort().reverse().map(day => {
      let dayMeta = days[day];
      return (
        <StoryDetailSession key={day}
          day={parseInt(day)}
          hours={dayMeta.hours}
          isTiming={dayMeta.isOpen}
          story={story} />
      );
    });
  },
  
  render() {
    let classes = {
      'st-storydetail': true,
      'st-child-pane': true
    };
    
    let story = this.state ? this.state.story : {}
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
          <i className="icon-arrow-left" onClick={this.goBack}></i>
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
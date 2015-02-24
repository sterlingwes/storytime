import React from "react";
import Router from "react-router";
import StoryDetailSesssion from "./storysession.js";

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
        return this.goBack();
    }
  },
  
  refocus() {
    this.refs.keyInput.getDOMNode().focus();
  },
  
  consolidateSessions(story) {
    let days = {};
    
  },
  
  render() {
    let classes = {
      'st-storydetail': true
    };
    
    let params = this.getParams()
      , story = store.getById(params.id);
    
    return (
      <div className={cx(classes)}>
        <div className="st-detail-header">
          <span className="st-detail-project">{ story.get('project') }</span>
          <span className="st-detail-name">{ story.get('name') }</span>
        </div>
        <ul className="st-detail-hours">
          { this.consolidateSessions(story) }
        </ul>
        <input className="st-detail-input"
          ref="keyInput"
          onKeyDown={this.key}
          onBlur={this.refocus} />
      </div>
    );
  }
});
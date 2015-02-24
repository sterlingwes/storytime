import _ from "lodash";
import m from "moment";

const FROM_MILLISECONDS = 3600000;

class Story {
  constructor(props, id) {
    this.id = id;
    this.props = props || {};
    let latestPeriod = 0;
    this.props.hours = this.props.hours || [];
    this.props.hours = this.props.hours.map(period => {
      if(period.end > latestPeriod) latestPeriod = period.end;
      return {
        start: m(period.start),
        end: m(period.end)
      };
    });
    
    this.sortIndex = latestPeriod;
  }
  
  get(key) {
    return this.props[key];
  }
  
  newSession() {
    this.props.hours.push({
      start: m()
    });
  }
  
  lastSession() {
    return this.props.hours[this.props.hours.length-1] || {};
  }
  
  hasOpenSession() {
    let lastSession = this.lastSession();
    return !!lastSession.start && !lastSession.end;
  }
  
  endSession() {
    if(this.hasOpenSession()) this.lastSession().end = m();
  }
  
  sessionCount() {
    return this.props.hours.length;
  }
  
  toJSON() {
    return _.extend({}, this.props, {
      hours: this.props.hours.map(period => {
        return {
          start: period.start.valueOf(),
          end: period.end ? period.end.valueOf() : undefined
        };
      })
    });
  }
  
  toString() {
    return this.sortIndex.toString();
  }
}

module.exports = Story;
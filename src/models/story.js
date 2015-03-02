import _ from "lodash";
import m from "moment";

const HOURS_FROM_MILLISECONDS = 3600000
    , MINUTES_FROM_MILLISECONDS = HOURS_FROM_MILLISECONDS / 60;

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
  
  consolidateTime(unit) {
    let days = {};
    this.props.hours.forEach(sesh => {
      let day = this.getDayValue(sesh.start);
      
      if(!days[day]) days[day] = { hours: 0, minutes: 0, isOpen: !sesh.end }

      let lastDate = sesh.end || m()
        , diff = lastDate - sesh.start;
        
      days[day].hours += Math.round(diff / HOURS_FROM_MILLISECONDS * 100) / 100;
      days[day].minutes += Math.round(diff / MINUTES_FROM_MILLISECONDS);
      if(!sesh.end) days[day].isOpen = true;
    });
    
    // filter out near-zero values
    for(let d in days) {
      if(days[d].hours === 0.0) delete days[d];
    }
    
    return days;
  }
  
  getDayValue(moment) {
    return (new Date(moment.year(),moment.month(),moment.date())).valueOf();
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
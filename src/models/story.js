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
      let sortBasis = period.end || period.start;
      if(sortBasis > latestPeriod) latestPeriod = sortBasis;
      return {
        start: m(period.start),
        end: m(period.end)
      };
    });
    
    this.sortIndex = latestPeriod ? latestPeriod.valueOf() : m().valueOf();
  }
  
  get(key) {
    return this.props[key];
  }
  
  setSortIndex() {
    this.sortIndex = m().valueOf();
  }
  
  newSession() {
    this.props.hours.push({
      start: m()
    });
    this.setSortIndex();
  }
  
  lastSession() {
    return this.props.hours[this.props.hours.length-1] || {};
  }
  
  hasOpenSession() {
    let lastSession = this.lastSession();
    return !!lastSession.start && !lastSession.end;
  }
  
  endSession() {
    if(this.hasOpenSession()) {
      this.lastSession().end = m();
      this.setSortIndex();
    }
  }
  
  closeAllSessions() {
    this.props.hours.forEach(sesh => {
      if(!sesh.end) {
        sesh.end = m();
        this.setSortIndex();
      }
    });
  }
  
  sessionCount() {
    return this.props.hours.length;
  }
  
  consolidateTime() {
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
  
  offsetTime(moment, msecs) {
    let msecsLeft = Math.abs(msecs)
      , daySessions = this.getSessionsForDay(moment)
      , count = 0;
      
    while(msecsLeft > 0 && count < daySessions.length) {
      let day = daySessions[count]
        , startVal = day.start.valueOf();
        
      if(msecs > 0) {
        day.start = m(startVal - msecs); // adding time by moving start date back
        msecsLeft = 0;
      }
      else { // we potentially run out of time when negative offsetting, so check for that
        let endDt = day.end || m()
          , endVal = endDt.valueOf()
          , sessionDuration = endVal - startVal;
          
        if(sessionDuration < msecsLeft) {
          msecsLeft = msecsLeft - sessionDuration;
          day.start = endDt.clone();
        }
        else { // one session will do it
          day.start = m(startVal - msecs);
          msecsLeft = 0;
        }
      }
      count++;
    }
  }
  
  getSessionsForDay(moment) {
    let hours = [];
    this.props.hours.forEach(sesh => {
      if(moment.isSame(sesh.start, 'day')) hours.push(sesh);
    });
    return hours;
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
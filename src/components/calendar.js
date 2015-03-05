import React from "react";
import moment from "moment";
import _ from "lodash";

var DayNames = React.createClass({
  render: function() {
    return (
      <div className="week names">
        <span className="day">Sun</span>
        <span className="day">Mon</span>
        <span className="day">Tue</span>
        <span className="day">Wed</span>
        <span className="day">Thu</span>
        <span className="day">Fri</span>
        <span className="day">Sat</span>
      </div>
    );
  }
});

var Week = React.createClass({
  dayHours(m,d) {
    let a = this.props.data || {}
      , hours = a[m] && a[m][d] && a[m][d].hours;

    if(_.isNumber(hours)) return <span className="st-calhours">{hours}</span>;
  },
  
  render: function() {
    var days = [],
    date = this.props.date,
    month = this.props.month;
    
    for (var i = 0; i < 7; i++) {
      var day = {
        name: date.format("dd").substring(0, 1),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      };
      days.push(
        <span key={day.date.toString()}
          className={"day" + (day.isToday ? " today" : "") + (day.isCurrentMonth ? "" : " different-month") + (day.date.isSame(this.props.selected) ? " selected" : "")}
          onClick={this.props.select.bind(null, day)}>
          {day.number}{ this.dayHours(date.month(),day.number) }
        </span>
      );
      date = date.clone();
      date.add(1, "d");
      
    }
    
    return <div className="week" key={days[0].toString()}>
    {days}
    </div>;
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    return {
      month: this.props.selected.clone()
    };
  },
  
  getDefaultProps() {
    return {
      selected: moment().startOf('day')
    };
  },
  
  previous: function() {
    var month = this.state.month;
    month.add(-1, "M");
    this.setState({ month: month });
    this.props.onChange(month);
  },
  
  next: function() {
    var month = this.state.month;
    month.add(1, "M");
    this.setState({ month: month });
    this.props.onChange(month);
  },
  
  select: function(day) {
    this.props.onSelection(day);
    return;
    
    // TODO: this is hacky, change state instead
    this.props.selected = day.date;
    this.forceUpdate();
  },
  
  render: function() {
    return (
      <div className={this.props.className}>
        <div className="header">
          {this.renderMonthLabel()}
          <i className="icon-arrow-left" onClick={this.previous}></i>
          <i className="icon-arrow-right" onClick={this.next}></i>
        </div>
        <DayNames />
        {this.renderWeeks()}
      </div>
    );
  },
  
  renderWeeks: function() {
    var weeks = [],
    done = false,
    date = this.state.month.clone().startOf("month").add("w" -1).day("Sunday"),
    monthIndex = date.month(),
    count = 0;
    
    while (!done) {
      weeks.push(<Week key={date.toString()} date={date.clone()} month={this.state.month} select={this.select} selected={this.props.selected} data={this.props.data} />);
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
    
    return weeks;
  },
  
  renderMonthLabel: function() {
    return <span>{this.state.month.format("MMMM, YYYY")} <i className="icon-cross" onClick={this.props.onClose} /></span>;
  },
});
import dom from "../support/dom" // must load before React

import React from "react/addons"
import Calendar from "../../src/components/calendar"
import moment from "moment"
import expect from "expect.js"
import sinon from "sinon"

const TestUtils = React.addons.TestUtils;

describe('<Calendar />', function() {
  
  before('render and locate element', ()=> {
    
    var renderTarget = document.getElementsByTagName('body')[0]
      , renderedComponent = React.render(
          <Calendar
            className="calendar"
            selected={moment(new Date(2015,02,03)).startOf("day")} />,
          renderTarget
        );
        
    this.cal = TestUtils.findRenderedDOMComponentWithClass(
      renderedComponent, 'calendar'
    );
    this.calEl = this.cal.getDOMNode();
    
    this.head = TestUtils.findRenderedDOMComponentWithClass(
      renderedComponent, 'header'
    );
    this.headEl = this.head.getDOMNode();
  });
  
  describe('rendering', ()=> {
    it('provide the month of march with the 3rd selected', ()=> {
      expect(this.headEl.textContent.trim()).to.be('March, 2015');
    });
  });
})
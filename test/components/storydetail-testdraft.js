import dom from "../support/dom" // must load before React

import React from "react/addons"
import DetailComponent from "../../src/components/storydetail"
import contextWrapper from "../support/context"
import expect from "expect.js"
import sinon from "sinon"

const TestUtils = React.addons.TestUtils;

describe('<StoryDetail />', function() {
  
  before('render and locate element', ()=> {
    
    let renderTarget = document.getElementsByTagName('body')[0]
      , StoryDetail = contextWrapper(DetailComponent, {
        }, {
          transitionTo() {

          },
          getParams() {

          }
        });
      
    this.renderedComponent = React.render(<StoryDetail />, renderTarget);

    this.div = TestUtils.findRenderedDOMComponentWithClass(
      this.renderedComponent, 'st-storydetail'
    );

    this.el = this.div.getDOMNode();
    
  });
  
  describe('left arrow', ()=> {
    it('should transition back to the story list', ()=> {
      TestUtils.Simulate.keyDown(this.el, { keyCode: 37 });
    });
  });
})
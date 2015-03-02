import dom from "../support/dom" // must load before React

import React from "react/addons"
import { expect, sinon } from "../support/tools"
import Store from "../../src/data/store"

const TestUtils = React.addons.TestUtils
    , storySeed = require('../data/stories');

localStorage.clear();
let store = new Store(storySeed); // setup data before executing storylist
import StoryList from "../../src/components/storylist"

describe('<StoryList />', function() {
  
  before('render and locate element', ()=> {

    // stub methods
    let getQueryFn = ()=> { return { select: 0 } };
    this.getQueryStub = sinon.stub(StoryList.type.prototype.__reactAutoBindMap, "getQuery", getQueryFn);
    
    let renderTarget = document.getElementsByTagName('body')[0];
    this.renderedComponent = React.render(<StoryList />, renderTarget);

    this.listDiv = TestUtils.findRenderedDOMComponentWithClass(
      this.renderedComponent, 'st-storylist'
    );

    this.listEl = this.listDiv.getDOMNode();
    
    this.searchBar = TestUtils.findRenderedDOMComponentWithClass(
      this.renderedComponent, 'st-search'
    );
    
    this.searchEl = this.searchBar.getDOMNode();
    
    this.searchInput = TestUtils.findRenderedDOMComponentWithClass(
      this.renderedComponent, 'st-searchinput'
    );

    this.inputEl = this.searchInput.getDOMNode();
    
    this.search = queryString => {
      TestUtils.Simulate.change(this.inputEl, {target: {value: queryString}});
    };
    
    this.isSelected = index => {
      return this.listEl.childNodes[index].className.indexOf('st-selected')>=0;
    };
  });
  
  it('should list stories', ()=> {
    expect(this.listDiv.props.children.length).to.be(3);
  });
  
  it('should track scroll state', ()=> {
    expect(this.searchEl.className).to.be('st-search');
    TestUtils.Simulate.scroll(this.listEl, { target: { scrollTop: 10} });
    expect(this.searchEl.className).to.be('st-search scrolling');
  });
  
  describe('searching', ()=> {
    it('should hide stories that do not match the query', ()=> {
      let nodeList = this.listEl.childNodes;
      this.search('one');
      expect(nodeList).to.have.length(2);
      this.search('two');
      expect(nodeList).to.have.length(1);
    });
    
    it('should set an empty search when the input first receives focus', ()=> {
      expect(this.renderedComponent.state.searchStr).to.be('two');
      TestUtils.Simulate.focus(this.inputEl);
      expect(this.renderedComponent.state.searchStr).to.be('');
    });
  });
  
  describe('keyboard events', ()=> {
    before(()=> {
      this.search('');
    });
    
    it('should allow for keyboard selection down', ()=> {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 40 });
      expect(this.isSelected(0)).to.be(false);
      expect(this.isSelected(1)).to.be(true);
    });
    
    it('should allow for keybaord jump to top', () => {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 38, metaKey: true });
      expect(this.isSelected(0)).to.be(true);
    });
    
    it('should allow for keyboard selection up', ()=> {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 38, metaKey: false });
      expect(this.isSelected(2)).to.be(true);
    });
    
    it('should start the timer on enter', ()=> {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 13 });
      expect(this.listEl.childNodes[2].className.indexOf('st-timing')>=0).to.be(true);
    });
    
    it('should stop the timer on enter after it has started', ()=> {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 13 });
      expect(this.listEl.childNodes[2].className.indexOf('st-timing')>=0).to.be(false);
    });
    
    it('should stop prior timers when starting one that is not the current timer', ()=> {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 38 });
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 13 });
      expect(this.listEl.childNodes[1].className.indexOf('st-timing')>=0).to.be(true);
      expect(this.listEl.childNodes[2].className.indexOf('st-timing')>=0).to.be(false);
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 40 });
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 13 });
      expect(this.listEl.childNodes[1].className.indexOf('st-timing')>=0).to.be(false);
      expect(this.listEl.childNodes[2].className.indexOf('st-timing')>=0).to.be(true);
    });
    
    it('should allow for keybaord jump to bottom', () => {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 40, metaKey: true });
      expect(this.isSelected(2)).to.be(true);
    });
    
    it('should close the pop-up on ESCape', ()=> {
      sinon.spy(global.quark, 'closePopup');
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 27 });
      expect(global.quark.closePopup.calledOnce).to.be(true);
    });
    
    it('should allow for creating stories', ()=> {
      this.search('test :)');
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 13, metaKey: true });
      expect(this.listEl.childNodes.length).to.be(4);
      expect(this.isSelected(0)).to.be(true);
      
      let story = JSON.parse(localStorage.getItem('st'))[3];
      expect(story.name).to.be(':)');
      expect(story.project).to.be('test');
    });
    
    it('should allow for deleting stories', ()=> {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 8, metaKey: true });
      expect(this.listEl.childNodes.length).to.be(3);
      let storyNames = JSON.parse(localStorage.getItem('st')).map(story => { return story.name });
      expect(storyNames).to.eql(['Planning','Support',':)']);
    });
  });
})
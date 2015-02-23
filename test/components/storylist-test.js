import dom from "../support/dom"
import React from "react/addons"
import expect from "expect.js"
import sinon from "sinon"
import Store from "../../src/data/store"

const TestUtils = React.addons.TestUtils
    , storySeed = require('../data/stories');

localStorage.clear();
let store = new Store(storySeed); // setup data before executing storylist
import StoryList from "../../src/components/storylist"

describe('<StoryList />', function() {
  
  before('render and locate element', ()=> {
    
    let renderTarget = document.getElementsByTagName('body')[0]
      , renderedComponent = React.render(<StoryList />, renderTarget);

    this.listDiv = TestUtils.findRenderedDOMComponentWithClass(
      renderedComponent, 'st-storylist'
    );

    this.listEl = this.listDiv.getDOMNode();
    
    this.searchBar = TestUtils.findRenderedDOMComponentWithClass(
      renderedComponent, 'st-search'
    );
    
    this.searchEl = this.searchBar.getDOMNode();
    
    this.searchInput = TestUtils.findRenderedDOMComponentWithClass(
      renderedComponent, 'st-searchinput'
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
      let hiddenStories = 0
        , nodeList = this.listEl.childNodes;
      this.search('one');
      for(let ni = 0; ni < nodeList.length; ni++) {
        let node = nodeList[ni];
        if(node.className.indexOf('hidden') >= 0) hiddenStories++;
      }
      expect(nodeList[0].className.indexOf('st-selected')>=0).to.be(true);
      expect(hiddenStories).to.be(1);
      expect(nodeList.length - hiddenStories).to.be(2);
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
    
    // it('should start the timer on enter', ()=> {
    //   TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 13 });
    //   expect(this.listEl.childNodes[2].className.indexOf('st-timimg')>=0).to.be(true);
    // });
    
    it('will soon handle left and right', ()=> {
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 37 });
      TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 39 });
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
    
    // it('should allow for creating stories', ()=> {
    //   this.search('test');
    //   TestUtils.Simulate.keyDown(this.inputEl, { keyCode: 13, metaKey: true });
    //   expect(this.listEl.childNodes.length).to.be(4);
    // });
  });
})
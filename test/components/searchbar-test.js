import React from "react/addons"
import dom from "../support/dom"
import SearchBar from "../../src/components/searchbar"
import expect from "expect.js"
import sinon from "sinon"

const TestUtils = React.addons.TestUtils;

describe('<SearchBar />', function() {
  
  before('render and locate element', ()=> {
    //
    // this.onSearchFn = sinon.spy();
    // this.onKeyFn = sinon.spy();
    // this.onScrollFn = sinon.spy();
    
    var renderTarget = document.getElementsByTagName('body')[0]
      , renderedComponent = React.render(
          <SearchBar
            onSearch={this.onSearchFn}
            keyHandler={this.onKeyFn}
            isScrolling={this.onScrollFn} />,
          renderTarget
        );
        
    this.focusEl = document.createElement('input')
    renderTarget.appendChild(this.focusEl);

    this.searchDiv = TestUtils.findRenderedDOMComponentWithClass(
      renderedComponent,
      'st-search'
    );
    
    this.settingsIcon = TestUtils.findRenderedDOMComponentWithClass(
      renderedComponent,
      'icon-cog'
    );
    
    this.searchInput = TestUtils.findRenderedDOMComponentWithTag(
      renderedComponent,
      'input'
    );

    this.inputEl = this.searchInput.getDOMNode();
    this.settingsBtn = this.settingsIcon.getDOMNode();
    
    this.search = queryString => {
      TestUtils.Simulate.change(this.inputEl, {target: {value: queryString}});
    };
  });
  
  // beforeEach('reset spies', ()=> {
  //   this.onSearchFn.reset();
  //   this.onKeyFn.reset();
  //   this.onScrollFn.reset();
  // });
  
  describe('search input', ()=> {
    it('should autofocus on mount', ()=> {
      expect(document.activeElement).to.eql(this.inputEl);
    });
    
    // it('should clear the search if refocused', ()=> {
    //   TestUtils.Simulate.click(this.focusEl);
    //   TestUtils.Simulate.click(this.inputEl);
    //   expect(this.inputEl.value).to.eql('');
    // });
  });
  
  describe('settings icon', ()=> {
    it('should open the settings dialog', ()=> {
      sinon.spy(global.quark, 'openPreferences');
      TestUtils.Simulate.click(this.settingsIcon);
      expect(global.quark.openPreferences.calledOnce).to.be(true);
    });
  });
})
const React = require('react')
    , Router = require('react-router')
    , Story = require('./story')
    , SearchBar = require('./searchbar')
    , keyEventHandler = require('./')
    , Actions = require('../data/actions')
    , store = require('../data/index')
    , _ = require('lodash')
    
    , DEFAULT_SEARCH_REGEX = /.*/
  ;

module.exports = React.createClass({
  
  mixins: [ Router.Navigation, Router.State ],
  
  //
  // LIFECYCLE METHODS =========================================================
  //
  
  getState() {
    let selection = store.getPref('selection')
      , currentTimer = store.getPref('current')
      , stories = this.getVisibleStories()
      , storyIndex = stories.map(story => { return story.id });
      
    if(!_.any(stories, story=> { return story.id === selection }))
      selection = stories.length ? stories[0].id : '';
      
    return {
      currentTimer: currentTimer || '',
      selectStory: selection || '',
      stories: stories,
      storyIndex: storyIndex
    };
  },
  
  getInitialState() {
    return _.extend({
      currentTimer: '', // points to unique ID of timed story
      returned: false, // indicates we've already handled a return query param to reset the last selection
      searchName: DEFAULT_SEARCH_REGEX,
      searchProj: DEFAULT_SEARCH_REGEX,
      searchhStr: '',
      selectStory: '', // unique ID of selected story
      scrolling: false,
      stories: [],
      transitioning: false
    }, this.getState());
  },

  getDefaultProps() {
    return {};
  },
  
  componentDidMount() {
    store.addChangeListener(this.onModelChange);
  },
  
  componentWillUnmount() {
    store.removeChangeListener(this.onModelChange);
  },
  
  //
  // EVENT HANDLERS ============================================================
  //
  
  onModelChange(payload) {
    this.setState(this.getState(), ()=> {
      //console.log('onModelChange', arguments[0], this.state);
    });
  },
  
  onSearchChange(event) {
    let q = event.target.value;
    this.onSearch(q);
  },
  
  onSearchFocus() {
    this.onSearch();
  },
  
  /*
   * Fires when the main listview scrolls so that a drop
   * shadow can be applied to the header
   */
  onListScroll(e) {
    let isScrolling = e.target.scrollTop > 0;
    this.setState({ scrolling: isScrolling });
  },
  
  /*
   * onSearch(query) gets called by the SearchBar component to pass along
   * the latest query and reset the selected item to 0
   */
  onSearch(q) {
    let nameRegex, projRegex;
    if(!q)  nameRegex = projRegex = DEFAULT_SEARCH_REGEX;
    else {
      let qRegXSafe = q.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
        , qParts = qRegXSafe.split(/\s/)
        , qProj = qParts.shift();
      nameRegex = new RegExp("\\b(" + qRegXSafe + ')', 'i');
      projRegex = new RegExp("\\b(" + qProj + ")", 'i');
    }

    this.setState({
      searchProj: projRegex,
      searchName: nameRegex,
      searchStr: q || ''
    }, ()=>{
      this.onModelChange();
    });
  },
  
  //
  // GETTERS ===================================================================
  //
  
  /*
   * getList() returns a reference to the listview DOM node
   */
  getList() {
    return this.refs.list.getDOMNode();
  },
  
  getVisibleStories() {
    return store.fetch().filter(story => {
      return this.matchSearch(story);
    });
  },
  
  getSelectedIndex() {
    if(!this.state || !this.state.selectStory) return 0;
    let selectionIndex = this.state.storyIndex.indexOf(this.state.selectStory);
    return selectionIndex > -1 ? selectionIndex : 0;
  },
  
  /*
   * hasTimer() indicates whether there's currently a story being timed
   * if id is passed in, checks whether that story is being timed
   */
  hasTimer(id) {
    if(!this.state) return false;
    if(id) return this.state.currentTimer == id || store.started(id);
    return !!this.state.currentTimer;
  },
  
  /*
   * matchSearch(story) takes a story object and checks whether it matches
   * the current search query regex
   */
  matchSearch(story) {
    if(!this.state) return true;
    if(this.state.searchName.test(story.get('name'))
      || this.state.searchProj.test(story.get('project')))
      return true;
    
    return false;
  },
  
  parseStoryAttributes() {
    if(!this.state.searchStr) return;
    
    let searchParts = this.state.searchStr.split(/\s/)
      , project = searchParts.shift();
      
    if(!searchParts.length) {
      searchParts.push(project);
      project = 'Misc';
    }
    
    return [ project, searchParts.join(' ') ];
  },
  
  //
  // SETTERS ===================================================================
  //
  
  resetSearch(cb) {
    this.setState({
      searchName: DEFAULT_SEARCH_REGEX,
      searchProj: DEFAULT_SEARCH_REGEX,
      searchStr: '',
      selectStory: ''
    }, ()=> { if(typeof cb === 'function') cb(); });
  },
  
  //
  // USER ACTIONS ==============================================================
  //

  /*
   * onKeyDown(event) handles all key events in the SearchBar
   */
  onKeyDown(e) {
    switch(e.keyCode) {
      case 8:
        if(e.metaKey) this.deleteSelection();
        return;
      case 13: // return
        if(e.metaKey) return this.addStory();
        return this.startTimer();
      case 27: // esc
        return quark.closePopup();
      // arrows
      case 37: // left
        return;
      case 38: // up
        if(e.metaKey) return this.scrollTop();
        return this.moveSelection(-1);
      case 39: // right
        this.showDetail();
        return e.preventDefault();
      case 40: // down
        if(e.metaKey) return this.scrollBottom();
        return this.moveSelection(1);
      //
    }
  },
  
  defaultSelection(action) {
    if(!this.state) return;
    let stories = this.state.stories;
    if(!this.state.selectStory && stories[0]) {
      this.setState({ selectStory: stories[0].id }, ()=> {
        action();
      });
    }
    else action();
  },
  
  /*
   * deleteSelection() will prompt the user to delete the selected story
   */
  deleteSelection() {
    this.defaultSelection(()=>{
      quark.pin();
      if(confirm('Are you sure you want to delete this item?')) {
        Actions.deleteStory(this.state.selectStory);
        this.scrollTop();
        quark.unpin();
      } else quark.unpin();
    });
  },
  
  /*
   * addStory() adds a story to match the current searchbar input
   */
  addStory() {
    let storyProps = this.parseStoryAttributes();
    this.resetSearch(()=> {
      Actions.addStory.apply(null, storyProps);
    });
  },
  
  showDetail() {
    this.defaultSelection(()=> {
      this.setState({
        lastDetail: this.state.selectStory,
        transitioning: true
      });
      if(this.state.selectStory) {
        this.transitionTo('detail', { id: this.state.selectStory });
      }
    });
  },
  
  /*
   * moveSelection(direction) handles keyboard navigation up / down the list
   * direction should be a +1 or -1
   */
  moveSelection(direction) {
    let current = this.getSelectedIndex() + direction
      , max = this.state.stories.length;
    
    if(current >= max) current = 0;
    if(current < 0) current = max - 1;
    
    Actions.setSelection(this.state.storyIndex[current]);
    
    let yPos = current * 36
      , listNode = this.getList();
    
    // if we're scrolling from off-top
    if(yPos < listNode.scrollTop)
      listNode.scrollTop = yPos - 20;
      
    // if we're scrolling from off-bottom
    if((yPos + 36) >= (listNode.scrollTop + listNode.offsetHeight))
      listNode.scrollTop = yPos + 36;
  },
  
  scrollTop() {
    Actions.setSelection(this.state.stories[0].id);
  },
  
  scrollBottom() {
    let list = this.getList();
    list.scrollTop = list.scrollHeight;
  },
  
  /*
   * startTimer() for the current selected list item, fired by keyPress (enter)
   */
  startTimer() {
    let selectionId = this.state.selectStory
      , lastTimer = this.stopTimer();
    // if the stopped timer equals this list item index, don't restart
    if(lastTimer === selectionId) return;
    
    let target = store.getById(selectionId);
    if(target) {
      Actions.startTimer(selectionId);
      // set the menu label to the current project name
      quark.setLabel(target.get('project'));
      // keep the overlay open for a few ms after starting to show change
      setTimeout(()=> { quark.closePopup() }, 300);
    }
  },
  
  /*
   * stopTimer stops any current timers
   * returns the timer that was stopped
   */
  stopTimer() {
    let startTimer = this.state.currentTimer;
    if(this.hasTimer()) {
      // close the open timing session
      Actions.stopTimer(startTimer);
      quark.setLabel('');
    }
    return startTimer;
  },
  
  //
  // RENDERING & RENDER HELPERS ================================================
  //
  
  render() {
    
    let list;
    
    if(this.state.stories.length) {
      list = (
        <div ref="list" className="st-storylist" onScroll={this.onListScroll}>
          { this.storyItems() }
        </div>
      );
    }
    else {
      list = (
        <div className="st-storylist-empty">
          <div><i className="icon-clock"></i></div>
          <div className="small">
            Use your keyboard to get around StoryTime.
            <br/><br/>
            <b><i className="icon-command"></i> + L</b> will focus the search box if lost.
            <br/><br/>
            When adding a story, the first whole word is the project name.
            <br/><br/>
            <i className="icon-cog"></i> > <b>Shortcuts</b> for more helpful hints.
          </div>
        </div>
      );
    }
    
    return (
      <div className="st-main">
        <SearchBar
          onSearch={this.onSearch}
          onChange={this.onSearchChange}
          onFocus={this.onSearchFocus}
          keyHandler={this.onKeyDown}
          query={this.state.searchStr}
          addHint={this.addHint}
          isScrolling={this.state.scrolling}
          isTransitioning={this.state.transitioning} />
        { list }
      </div>
    );
  },
  
  /*
   * getStories() handles filtering the story list based on search queries
   * as well as passing along state such as whether a story is being timed
   * or is selected
   */
  storyItems() {
    let selectedIndex = this.getSelectedIndex();
    return this.state.stories.map( (story,i) => {
      return <Story key={i}
                  story={story.get('name')}
                  isSelected={selectedIndex === i}
                  isTiming={this.hasTimer(story.id)}
                  project={story.get('project')} />;
    });
  },
  
  addHint() {
    if(!this.state || !this.state.searchStr) return;
    if(this.state.stories.length) return;
    let parts = this.parseStoryAttributes();
    return (
      <div className="st-search-hint">
        <i className="icon-arrow-up"></i> Use <b><i className="icon-command"></i> + Enter</b> to add <b>{parts[1]}</b> to the <b>{parts[0]}</b> project
      </div>
    );
  },
})
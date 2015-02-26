const React = require('react')
    , Router = require('react-router')
    , Story = require('./story')
    , SearchBar = require('./searchbar')
    , keyEventHandler = require('./')
    
    , store = require('../data/index')
    
    , DEFAULT_SEARCH_REGEX = /.*/
  ;

module.exports = React.createClass({
  
  mixins: [ Router.Navigation, Router.State ],
  
  getInitialState() {
    return {
      currentTimer: '', // points to unique ID of timed story
      returned: false, // indicates we've already handled a return query param to reset the last selection
      searchName: DEFAULT_SEARCH_REGEX,
      searchProj: DEFAULT_SEARCH_REGEX,
      searchhStr: '',
      stories: this.getStories(),
      selectIndex: 0,  // index of selected story (based on state.stories order)
      selectStory: '', // unique ID of selected story
      scrolling: false
    };
  },

  getDefaultProps() {
    return {};
  },
  
  componentDidMount() {
    store.setListener(()=> { this.setStories() });
  },
  
  /*
   * getList() returns a reference to the listview DOM node
   */
  getList() {
    return this.refs.list.getDOMNode();
  },
  
  /*
   * getStories() handles filtering the story list based on search queries
   * as well as passing along state such as whether a story is being timed
   * or is selected
   */
  getStories() {
    let filteredIndex = -1
      , returned = this.state ? this.state.returned : false
      , q = this.getQuery();
      
    return store.fetch().map( (story,i) => {
      let visible = this.matchSearch(story);
      if(visible) filteredIndex++;
      let selectedIndex = this.state ? this.state.selectIndex : 0;

      // if we're returning, don't default to selecting the first item
      if(q.select && !returned && selectedIndex === 0) selectedIndex = false;

      // if we're returning from a detail view, reselect that story
      if(q.select && q.select == story.id && !returned) {
        returned = true;
        selectedIndex = filteredIndex;
      }
      
      let isSelected = selectedIndex === filteredIndex;
      
      if(isSelected) {
        this.setState({
          selectStory: story.id,
          selectIndex: selectedIndex,
          returned: returned
        });
      }
      
      return <Story key={i}
                  story={story.get('name')}
                  isSelected={isSelected}
                  isVisible={visible}
                  isTiming={this.hasTimer(story.id)}
                  project={story.get('project')} />;
    });
  },
  
  /*
   * setStories(callback) is the primary method for forcing a redraw of the
   * listview by setting the filtered stories to state.stories
   */
  setStories(cb) {
    this.setState({
      stories: this.getStories()
    }, ()=> { if(cb) cb(); });
  },
  
  /*
   * moveSelection(direction) handles keyboard navigation up / down the list
   * direction should be a +1 or -1
   */
  moveSelection(direction) {
    let current = this.state.selectIndex + direction
      , max = this.state.stories.length;
    
    if(current >= max) current = 0;
    if(current < 0) current = max - 1;
    this.setState({ selectIndex: current }, ()=> {
      this.setStories(()=>{
        let yPos = this.state.selectIndex * 36
          , listNode = this.getList();
        
        // if we're scrolling from off-top
        if(yPos < listNode.scrollTop)
          listNode.scrollTop = yPos - 20;
          
        // if we're scrolling from off-bottom
        if((yPos + 36) >= (listNode.scrollTop + listNode.offsetHeight))
          listNode.scrollTop = yPos + 36;
      });
    });
  },
  
  scrollTop() {
    this.setState({
      selectIndex: 0
    }, () => {
      this.setStories();
    });
  },
  
  scrollBottom() {
    let list = this.getList();
    list.scrollTop = list.scrollHeight;
  },
  
  /*
   * startTimer() for the current selected list item, fired by keyPress (enter)
   */
  startTimer() {
    this.stopTimer( lastTimer => {
      let selectionId = this.state.selectStory;
      // if the stopped timer equals this list item index, don't restart
      if(lastTimer === selectionId) return;
      
      let target = store.getById(selectionId);
      if(target) {
        store.start(selectionId);
        this.setState({ currentTimer: selectionId }, ()=> {
          this.setStories();
          // set the menu label to the current project name
          quark.setLabel(target.get('project'));
          // keep the overlay open for a few ms after starting to show change
          setTimeout(()=> { quark.closePopup() }, 300);
        });
      }
    });
  },
  
  /*
   * stopTimer(callback) stops any current timers
   * the callback(lastTimer) passes along the index of the stopped timer
   */
  stopTimer(cb) {
    let startTimer = this.state.currentTimer;
    if(this.hasTimer()) {
      // close the open timing session
      store.stop(startTimer);
      this.setState({ currentTimer: '' }, ()=> {
        quark.setLabel('');
        // refresh the listView
        this.setStories(cb(startTimer));
      });
    }
    // no currentTimer
    else cb(startTimer);
  },
  
  /*
   * deleteSelection() will prompt the user to delete the selected story
   */
  deleteSelection() {
    if(confirm('Are you sure you want to delete this item?')) {
      store.remove(this.state.selectStory);
      this.setStories(()=> {
        this.scrollTop();
      });
    }
  },
  
  /*
   * addStory() adds a story to match the current searchbar input
   */
  addStory() {
    if(!this.state.searchStr) return;
    
    let searchParts = this.state.searchStr.split(/\s/)
      , project = searchParts.shift();
      
    if(!searchParts.length) {
      searchParts.push(project);
      project = 'Misc';
    }
      
    store.save({
      project: project,
      name: searchParts.join(' ')
    });
    
    this.resetSearch();
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
  
  showDetail() {
    this.setState({
      lastDetail: this.state.selectStory
    });
    this.transitionTo('detail', { id: this.state.selectStory });
  },
  
  /*
   * onKeyDown(event) handles all key events in the SearchBar
   */
  onKeyDown(e) {
    //console.log(e.keyCode, 'ctrl'+e.ctrlKey, 'alt'+e.altKey, 'meta'+e.metaKey, 'shift'+e.shiftKey);
    
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
        return this.showDetail()
      case 40: // down
        if(e.metaKey) return this.scrollBottom();
        return this.moveSelection(1);
      //
    }
  },
  
  /*
   * onSearch(query) gets called by the SearchBar component to pass along
   * the latest query and reset the selected item to 0
   */
  onSearch(q) {
    let nameRegex, projRegex;
    if(!q)  nameRegex = projRegex = DEFAULT_SEARCH_REGEX;
    else {
      let qParts = q.split(/\s/)
        , qProj = qParts.shift();
      nameRegex = new RegExp("\\b(" + q + ')', 'i');
      projRegex = new RegExp("\\b(" + qProj + ")", 'i');
    }
    this.setState({
      searchProj: projRegex,
      searchName: nameRegex,
      searchStr: q || '',
      selectIndex: 0
    }, ()=> {
      this.setStories();
    });
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

  resetSearch() {
    this.setState({
      searchName: DEFAULT_SEARCH_REGEX,
      searchProj: DEFAULT_SEARCH_REGEX,
      searchStr: ''
    }, ()=> { this.setStories(); });
  },
  
  searchChange(event) {
    let q = event.target.value;
    this.onSearch(q);
  },
  
  searchFocused() {
    this.onSearch();
  },
  
  /*
   * scrolled(event) fires when the main listview scrolls so that a drop
   * shadow can be applied to the header
   */
  scrolled(e) {
    let isScrolling = e.target.scrollTop > 0;
    this.setState({ scrolling: isScrolling });
  },
  
  render() {
    return (
      <div className="st-main">
        <SearchBar
          onSearch={this.onSearch}
          onChange={this.searchChange}
          onFocus={this.searchFocused}
          keyHandler={this.onKeyDown}
          query={this.state.searchStr}
          isScrolling={this.state.scrolling} />
        <div ref="list" className="st-storylist" onScroll={this.scrolled}>
          { this.state.stories }
        </div>
      </div>
    );
  }
})
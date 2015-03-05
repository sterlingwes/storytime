const React = require('react/addons')
    , Router = require('react-router')
    , cx = React.addons.classSet;

module.exports = React.createClass({
  
  mixins: [ Router.Navigation ],
  
  getDefaultProps() {
    return {
      query: ''
    };
  },
  
  componentDidMount() {
    this.refs.searchInput.getDOMNode().focus();
  },
  
  showPrefs() {
    quark.openPreferences();
  },
  
  showStats() {
    this.transitionTo('/stats');
  },
  
  onUnFocus() {
    if(!this.props.isTransitioning)
      this.refs.searchInput.getDOMNode().focus();
  },
  
  quit() {
    quark.pin();
    if(confirm('Exit Storytime?')) {
      quark.quit();
    } else quark.unpin();
  },
  
  render() {
    let searchVal = this.props.query
      , classes = { 'st-search': true };
      
    if(this.props.isScrolling) classes['scrolling'] = true;
    
    return (
      <div className={cx(classes)}>
        <input id="searchInput"
          className="st-searchinput"
          ref="searchInput"
          type="text"
          placeholder="Type your Project or Story"
          onChange={this.props.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.onUnFocus}
          onKeyDown={this.props.keyHandler}
          value={searchVal}
          autoComplete="off"
          autofocus />
        <i className="icon-pie-graph rotate" onClick={this.showStats} />
        <i className="icon-cog rotate" onClick={this.showPrefs} />
        <i className="icon-cross" onClick={this.quit} />
        { this.props.addHint() }
      </div>
    );
  }
});
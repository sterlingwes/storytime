const React = require('react/addons')
    , cx = React.addons.classSet;

module.exports = React.createClass({
  
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
          onKeyDown={this.props.keyHandler}
          value={searchVal}
          autofocus />
        <i className="icon-cog rotate" onClick={this.showPrefs} />
      </div>
    );
  }
});
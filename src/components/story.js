const React = require('react')
    , cx = React.addons.classSet;

module.exports = React.createClass({
  
  getDefaultProps() {
    return {
      story: ''
    };
  },
  
  statusIcon() {
    if(this.props.isTiming) {
      return <i className="icon-play"></i>;
    }
  },
  
  render() {
    let classes = {
      'st-story': true,
      'st-selected': this.props.isSelected,
      'st-hidden': !this.props.isVisible,
      'st-timing': this.props.isTiming
    };
    
    return (
      <div className={cx(classes)}>
        <span className="st-projectlabel">{ this.props.project }</span>
        <span className="st-namelabel">{ this.props.story }</span>
        <span className="st-status">{ this.statusIcon() }</span>
      </div>
    );
  }
});
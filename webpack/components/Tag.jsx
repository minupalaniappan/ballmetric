import React, { PropTypes } from 'react';

const Tag = React.createClass({
  propTypes: {
    tag: React.PropTypes.string,
    active: React.PropTypes.bool,
    changeFilter: React.PropTypes.func
  },
  render: function() {
    return (
      <div className="row-tag" key={Math.random()} value={this.props.tag} onClick={this.props.activateFilter.bind(null, this)}>
        <p className={(this.props.active) ? "tag-text active" : "tag-text"} >{ this.props.tag }</p>
      </div>
    );
  }
});

export default Tag;


import React, { PropTypes } from 'react';

const Tag = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    active: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    changeFilter: React.PropTypes.func
  },
  render: function() {
    return (
      <div className={(this.props.title === 'RESET') ? "tag reset" : (this.props.active) ? "tag active" : (this.props.disabled) ? "tag unavailable" : "tag available"}>
        <div>
          <p className = "tag-title" key = {Math.random()} onClick={((!this.props.active || this.props.title === 'RESET') && !this.props.disabled) ? this.props.changeFilter : null} value = {this.props.title}>{this.props.title}</p>
        </div>
      </div>
    );
  }
});

export default Tag;
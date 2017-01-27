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
          <h4 key = {Math.random()} onClick={((!this.props.active || this.props.title === 'Reset') && !this.props.disabled) ? this.props.changeFilter : null} value = {this.props.title}>{this.props.title}</h4>
        </div>
      </div>
    );
  }
});

export default Tag;
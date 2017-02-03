import React, { PropTypes } from 'react';
const EvilIcon = require('./EvilIcon.jsx').default


const Stream = React.createClass({
  propTypes: {
    streamables: React.PropTypes.array,
    index: React.PropTypes.number,
    name: React.PropTypes.string,
    tagsToPush: React.PropTypes.array,
    totalUrl: React.PropTypes.string
  },
  getInitialState: function () {
    return ({
      index: this.props.index
    })
  },
  fetchLink: function (index) {
    var src = this.props.streamables.map((elem) => {
      return (elem['mp4']); 
    })[index];
    return (src);
  },
  videoEnded: function () {
    if (this.state.index == (this.props['streamables'].length-1)) {
      this.setState({
        index: 0
      })
    } else {
      this.setState({
        index: ++this.state.index
      });
    }
  }, 
  buildVideoComponent: function () {
    return (this.fetchLink(this.state.index));
  }, 
  fetchShareURL: function () {
    var str_cp = "?q=" + this.props.tagsToPush.join("-");
    if (this.props.totalUrl) {
      if (this.props.totalUrl.indexOf('?') >= 0) {
        return (this.props.totalUrl.split("?")[0] + str_cp)
      } else {
        return(this.props.totalUrl + str_cp)
      }
    }
    return (null);
  },
  buildShareComponent: function () {
    var url = this.fetchShareURL(); 
    return (
      <div><input value = {url} readOnly={true} className = "form-search formPosition"/></div> 
    );
  }, 
  render: function() {
    var url_box = this.buildShareComponent();
    var stream = this.buildVideoComponent();
    var game_id_ = this.props.streamables[this.state.index]['game_id'];
    return (
      <div>
        <div className = "center">
          <video id = "stream_frame" onEnded={this.videoEnded} autoPlay={false} controls = {true} src={stream} muted={true}/>
        </div>
        <div className= "margin">
          <div className = "loop-counter">
            <p className = "count inline">{this.state.index+1} of {this.props.streamables.length} plays</p>
            <div className = "inline margin-side">{ url_box }</div>
          </div>
        </div>
      </div>
    );
  }
});

export default Stream;
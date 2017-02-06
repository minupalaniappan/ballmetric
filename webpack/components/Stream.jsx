import React, { PropTypes } from 'react';


const Stream = React.createClass({
  propTypes: {
    streamables: React.PropTypes.array,
    index: React.PropTypes.number,
    name: React.PropTypes.string,
    wait: React.PropTypes.number
  },
  getInitialState: function () {
    return ({
      index: this.props.index,
      hidden: true
    })
  },
  componentWillMount : function () {
    var that = this;
    setTimeout(function() {
        that.show();
    }, that.props.wait);
  },
  show: function () {
    if (this.isMounted()) {
      var currentState = this.state.hidden;
      this.setState({
        hidden: !currentState
      });
    }
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
  control: function (event) {
    if (event.target.paused)
      event.target.play();
    else
      event.target.pause();
  },
  fullscreen: function (event) {
    console.log(event.target);
    event.target.webkitRequestFullScreen();
  },
  render: function() {
    var stream = this.buildVideoComponent();
    var game_id_ = this.props.streamables[this.state.index]['game_id'];
    var video_block;
    video_block = (!this.state.hidden)  ? (<div>
                              <div className = "center padding" id = "videocontroller">
                                <video id = "stream_frame" className="video" onClick={this.control} onDoubleClick = {this.fullscreen} onEnded={this.videoEnded} autoPlay={true} controls = {false} src={stream} muted={true} allowFullScreen={true}/>
                              </div>
                            </div>)
                            :
                            (<div className="overlay"><p>Loading...</p></div>);
    return (
      <div>{video_block}</div>
    );
  }
});

export default Stream;
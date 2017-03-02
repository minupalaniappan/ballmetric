import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import _ from 'underscore';
const Tag = require('./Tag.jsx').default
const ProgressBar = require('progressbar.js');
const moment = extendMoment(Moment);
const EvilIcon = require('./EvilIcon.jsx').default

const PlayerShow = React.createClass({
  propTypes: {
    player: React.PropTypes.object,
    prependedArguments: React.PropTypes.object
  },
  getInitialState: function () {
    return ({
        start: this.props.prependedArguments.start,
        end: this.props.prependedArguments.end,
        tag: this.props.prependedArguments.tag,
        videoId: this.props.prependedArguments.videoId, 
        mp4: "", 
        tags: [],
        dates: [], 
        outOfRange: false, 
        loading: true
    })
  }, 
  componentWillMount: function () {
    this.generateDatesOfGames((input) => {
      this.setDates(input);
    });
    this.engine(this.state.start, this.state.end, this.state.tag, this.state.videoId);
  },
  headBack: function () {
    browserHistory.push('/players');
    window.location.href = location;
  },
  headerBlock: function () {
    var player = this.props.player;
    return (
      <div className = "pos-rel">
        <div className="inline vert-middle pos-rel">
          <h1>{`${player.firstName} ${player.lastName}`}</h1>
          <h4>{`${player.heightFeet}'${player.heightInches} ${player.posExpanded} for ${player.citys[0]}`}</h4>
        </div>
        <div className="inline vert-middle btn-back" onClick={this.headBack}>
          <h4 className="back-link">View another player</h4>
        </div>
      </div>
    );
  },
  fetchJSON: function (args, player) {
    var url = $.param(args);
    return ($.getJSON('/api/v1/players/fetchPlay?' + url).then((data) => {
      if (data['status'] === "ERROR") {
        args.videoId = 0; 
        args.outOfRange = true;
        this.setState (args, ()=> {
          browserHistory.push(player['slug'] + `?start=${this.state.start}&end=${this.state.end}&videoId=${0}&tag=${this.state.tag}&playerid=${player['id']}`);
        });
      } else if (data.play.mp4.includes("__")) {
        return (false);
      } else {
        var tags = _.compact(_.uniq(_.pluck(data.tags, 'value')));
        args.outOfRange = false;
        this.setState (args, ()=> {
          browserHistory.push(player['slug'] + `?start=${this.state.start}&end=${this.state.end}&videoId=${this.state.videoId}&tag=${this.state.tag}&playerid=${this.state.playerid}`);
          this.setState({
              tags: tags, 
              mp4: data.play.mp4
          })
        }); 
      } 
      return (true);
    }));
  },
  engine: function (start, end, tag, videoId) {
    var args = {
      start: start,
      end: end,
      videoId: videoId,
      playerid: this.props.player.id,
      tag: tag
    }
    var flag_;
    this.fetchJSON(args, this.props.player).then((flag) => {
      if (flag) {
        this.setState({
          loading: false, 
        }, ()=> {
          setTimeout(function(){ document.getElementById("stream_frame").controls = true; }, 2000);
        });
      } else {
        this.engine(start, end, tag, parseInt(videoId) + 1)
      }
      
    });
  },
  setDates: function (input) {
    this.setState({
      dates: input
    });
  },
  generateDatesOfGames: function (callback) {
      var args = {
        start: 0,
        end: 82,
        playerid: this.props.player.id
      }
      var urlStr = $.param(args);
      $.getJSON('/api/v1/players/fetchGames?' + urlStr, (data) => {
        var returnedData = _.map(data.games, (game) => {
          game = game[0]
          return({
            day: game['day'], 
            month: game['month'], 
            year: game['year'], 
            date_object: new Date(game.year, game.month-1, game.day).toDateString()
          })
        }).filter(function(e){return e});
        callback(returnedData);

      });
  }, 
  control: function (event) {
    if (event.target.paused)
      event.target.play();
    else
      event.target.pause();
  },
  fullscreen: function (event) {
    event.target.webkitRequestFullScreen();
  },
  videoEnded: function () {
    var videoId; 
    var tag = this.state.tag; 
    var start = this.state.start; 
    var end = this.state.end;
    videoId = parseInt(this.state.videoId) + 1;
    this.engine(start, end, tag, videoId)
    this.setState({
      loading: true
    }, ()=> {
      if (document.getElementById("stream_frame")) {
        document.getElementById("stream_frame").controls = false;
      }
    })
  },
  bodyBlock: function () {
    var tagStream = this.generateTags();
    var videoStream = this.videoStream();
    return (
      <div style = {{margin: "10px 0px"}}>
        { videoStream }
        { tagStream }
      </div>
    )
  },
  activateFilter: function (event) {
    var tag = event.target.value;
    var start = this.state.start;
    var end = this.state.end;
    this.setState({
      tag: tag, 
      start: start,
      end: end, 
      loading: true
    }, () => {
      this.engine(start, end, tag, 0);
    })
  },
  generateTags: function () {
    var options = this.state.tags.map((tag_) => {
      return (
        <option value={tag_}
             key={Math.random()}
        >{tag_}</option>
      )
    });
    return (
      <div className = "inlMargin">
        <select value={this.state.tag} onChange={this.activateFilter} className = "tagList">
          <option value={"All"} key={Math.random()}>All</option>
          { options }
        </select>
      </div>
    )
  },  
  videoStream: function () {
    if (this.state.outOfRange)
      return (
        <div className="bg-back">
          <div className = "center-icon">
            <EvilIcon name="ei-check" size="m" className="eIcon"/>
            <p>Loop is done</p>
          </div>
        </div>
      );
    else
      return (
        <div className="posRel">
          {(this.state.loading) ? <EvilIcon name="ei-spinner-3" size="m" className="ico"/> : <video id = "stream_frame" className="video" onClick={this.control} allowFullScreen={true} onDoubleClick = {this.fullscreen} onEnded={this.videoEnded} autoPlay={true} src={this.state.mp4} muted={false} />}
        </div>);
  }, 
  render: function() {
    var header = this.headerBlock();
    var body = this.bodyBlock(); 
    return (
      <div>
        { header }
        { body }
      </div>
    );
  }
});

export default PlayerShow;

   
  
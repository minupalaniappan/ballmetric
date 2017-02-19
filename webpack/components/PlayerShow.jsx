import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import _ from 'underscore';
import Slider, { Range, Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
const Tag = require('./Tag.jsx').default
const Stream = require('./Stream.jsx').default
const moment = extendMoment(Moment);
const EvilIcon = require('./EvilIcon.jsx').default
const FetchTagObject = require ('../mapping.js').FetchTagObject

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
        index: this.props.prependedArguments.videoId, 
        mp4: "", 
        tags: [],
        dates: [], 
        scrubbing: false,
        outOfRange: false 
    })
  }, 
  componentWillMount: function () {
    this.generateDatesOfGames((input) => {
      this.setDates(input);
    });
    this.engine(this.state.start, this.state.end, this.state.tag, this.state.index);
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
  dateListener: function (event, elems) {
    this.setState({
      scrubbing: true,
      outOfRange: false
    }); 
    if (document.getElementById("stream_frame"))
      document.getElementById("stream_frame").pause();
  },  
  runEngine: function (event, elems) {
    this.setState({
      scrubbing: false
    }); 
    var start = elems[0];
    var end = elems[1];
    this.engine(start, end, "", 0)
    if (document.getElementById("stream_frame").src !== "") {
      document.getElementById("stream_frame").play();
    }
  },
  engine: function (start, end, tag, index) {
    var args = {
      start: start,
      end: end,
      tag: tag,
      videoId: index,
      playerId: this.props.player.id
    }
    var urlStr = $.param(args);
    var state = this;
    var player = this.props.player;
    $.getJSON('/api/v1/players/fetchPlay?' + urlStr, function(data) {
      if (data['status'] === "ERROR") {
        args.index = 0; 
        args.outOfRange = true;
        state.setState (args, ()=> {
          browserHistory.push(player['slug'] + `?start=${start}&end=${end}&videoId=${0}&tag=${tag}&playerId=${player['id']}`);
        });
      } else if (data.play.mp4.includes("__")) {
        console.log(this.state);
        state.engine(start, end, tag, (index+1));
      } else {
        var tags = _.compact(_.uniq(_.pluck(data.tags, 'value')));
        args.outOfRange = false;
        state.setState (args, ()=> {
          browserHistory.push(player['slug'] + `?start=${start}&end=${end}&videoId=${index}&tag=${tag}&playerId=${player['id']}`);
          state.setState({
              index: index,
              tags: tags, 
              mp4: data.play.mp4
          })
        }); 
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
        playerid: this.props.player['id']
      }
      var urlStr = $.param(args);
      $.getJSON('/api/v1/players/fetchGames?' + urlStr, (data) => {
        console.log(data);
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
  generateSlider: function () {
    var state = this.state;
      if (state['dates'].length) {
        var slider_props = {
          allowCross: false,
          pushable: false,
          min: 0,
          max: state.dates.length-1,
          defaultValue: [parseInt(state.start),parseInt(state.end)],
          onChange: this.dateListener.bind(null, this),
          onAfterChange: this.runEngine.bind(null, this),
          handle: (props) => {
            const { value, dragging, index } = props;
            return (
              <Tooltip
                overlay={state.dates[props.value]['date_object']}
                visible={dragging}
                placement="top"
                key={index}
              >
                <Handle {...props} />
              </Tooltip>
            );
        }
      }
      return (
        <div className = "tier-slider">
          <Range {...slider_props}/>
        </div>
      );
    }
  }, 
  control: function (event) {
    if (event.target.paused)
      event.target.play();
    else
      event.target.pause();
  },
  videoEnded: function () {
    var index; 
    var tag = this.state.tag; 
    var start = this.state.start; 
    var end = this.state.end;
    index = parseInt(this.state.index) + 1;
    this.engine(start, end, tag, index)

  },
  bodyBlock: function () {
    var slider = this.generateSlider();
    var videoStream = this.videoStream();
    var tagStream = this.generateTags();
    return (
      <div style = {{margin: "10px 0px"}}>
        <div className="bg-back">{(videoStream) ? (videoStream) : (<p>Scrubbing</p>)}</div>
        { slider }
        { tagStream }
      </div>
    )
  },
  activateFilter: function (event) {
    var tag = event.props.tag;
    var start = this.state.start;
    var end = this.state.end;
    this.engine(start, end, tag, 0)
  },
  generateTags: function () {
    var elements = this.state.tags.map((tag_) => {
      return (
        <Tag tag={tag_}
             active={this.state.tag === tag_}
             activateFilter={this.activateFilter}
             key={Math.random()}
        />
      )
    });
    return (
      <div className = "tagList">
        { elements }
      </div>
    )
  },  
  videoStream: function () {
    if (this.state.outOfRange)
      return (
        <div className="bg-back">
          <div className = "center-icon">
            <EvilIcon name="ei-question" size="m" className="eIcon"/>
            <p>Cannot find a play</p>
          </div>
        </div>
      );
    else
      return (
        <div className="posRel">
          {(this.state.scrubbing) ? <EvilIcon name="ei-spinner-3" size="m" className="eIcon ico"/> : ""}
          <div className={(this.state.scrubbing) ? "blur" : ""}>
            <video id = "stream_frame" className="video" onClick={this.control} onEnded={this.videoEnded} autoPlay={true} controls = {false} src={this.state.mp4} muted={true} />
          </div>
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

   
  
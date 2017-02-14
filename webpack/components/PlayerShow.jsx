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
    games: React.PropTypes.array,
    plays: React.PropTypes.array,
    prependedArguments: React.PropTypes.array,
    dates: React.PropTypes.array
  },
  getInitialState: function () {
    console.log(this.props.plays);
    return ({
      start: (this.props.dates[0] === "") ? 0 : this.props.dates[0],
      end: (this.props.dates[1] === "") ? 81 : this.props.dates[1],
      active: this.props.prependedArguments[0],
      tags: [], 
      plays: [], 
      tagSearchValue: ''
    })
  },
  handleChange: function (event) {
    var text = event.target.value;
    var all_tags = this.state.tags;
    this.setState({
      tagSearchValue: text, 
    }, () => {
      var tags_filtered = all_tags.filter((tag) => {
        var search_str = tag;
        if (search_str.search(new RegExp(text, "i")) != -1) {
          return tag;
        }
      });

      if (this.state.tagSearchValue === "") {
        var tags_filtered = this.fetchTags();
      }

      this.setState({
        tags: tags_filtered
      });
    });
  }, 
  componentDidMount: function () {
    var plays = this.filterPlays(this.props.prependedArguments[0]);
    var index  = (this.props.prependedArguments[1] === null) ? 1 : (plays.length <= this.props.prependedArguments[1]) ? 1 : this.props.prependedArguments[1]
    this.setState({
      start: (this.props.dates[0] === "") ? 0 : parseInt(this.props.dates[0]),
      end: (this.props.dates[1] === "") ? 81 : parseInt(this.props.dates[1]),
      plays: plays,
      active: this.props.prependedArguments[0],
      index: index,
      tags: this.fetchTags()
    })
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
  generateDatesOfGames: function () {
    var dates = _.map(this.props.games, (event)=> {
      var game_id = event['id'];
      var ids = _.uniq(_.pluck(this.props.plays, 'game_id'));
      if (_.contains(ids, game_id)) {
        return {
          day: event.day,
          month: event.month,
          year:event.year,
          id: event.day + " " + event.month + " " + event.year,
          date_object: new Date(event.year, event.month-1, event.day).toDateString()
        }
      }
    });
    return (dates.filter(function(e){return e}));
  },
  generateMarks: function (dates) {
    var marks = {}; 
    dates.forEach((date, index) => {
      if (date['day'] === 1) {
        marks[index] = date['date_object']
      }
    });
    return marks;
  }, 
  fetchTags: function () {
    var plays = this.fetchMP4s();
    var tagLays = [];
    plays.forEach((play) => {
      play['playermap'].forEach((player)=> {
        if (player['id'] === this.props.player['id']) {
          tagLays.push(FetchTagObject(player['tags'])); 
        }
      });
    });
    var tags = _.uniq(_.pluck(tagLays, 'value'));
    return (tags);
  }, 
  fetchMP4s: function (dummy) {
    var game_capture = this.props.games.slice(this.state.start, this.state.end);
    var plays = this.getPlays(game_capture);
    plays = plays.filter((play) => {
      return (_.contains(_.pluck(play['playermap'], 'id'), this.props.player['id']))
    });
    return (plays);
  },
  filterPlays: function (tag) {
    var active = tag;
    var player = this.props.player;
    var plays_ = this.fetchMP4s();
    if (active) {
      plays_ = plays_.filter((event) => {
        var flags = event['playermap'].map((pos) => {
          if (player['id'] === pos['id']) {
            return (active === FetchTagObject(pos['tags']).value)
          }
        });
        return (_.contains(flags, true))
      });
    }
    return (plays_);
  },
  dateListener: function (event, elems) {
    var player = this.props.player;
    this.setState({
      start: elems[0],
      end: elems[1], 
      index: 0
    }, () => {
      browserHistory.push(player['slug'] + `?start=${elems[0]}&end=${elems[1]}&video=${0}`);
      this.setState({
        active: "",
        plays: this.fetchMP4s(),
        tags: this.fetchTags()
      });
    });
  }, 
  getPlays: function (games) {
    var playArr = [];
    var gameIds = _.pluck(games, 'id'); 
    var plays = this.props.plays.filter((play) => {
      return (_.contains(gameIds, play['game_id']));
    }); 
    return (plays);
  },
  generateSlider: function () {
    var dates = _.uniq(this.generateDatesOfGames());
    var marks = this.generateMarks(dates)
    var slider_props = {
        allowCross: false,
        pushable: false,
        min: 0,
        max: dates.length-1,
        defaultValue: [parseInt(this.state.start),parseInt(this.state.end)],
        onChange: this.dateListener.bind(null, dates),
        marks: marks, 
        handle: (props) => {
          const { value, dragging, index } = props;
          return (
            <Tooltip
              overlay={dates[value]['date_object']}
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
    )
  }, 
  control: function (event) {
    if (event.target.paused)
      event.target.play();
    else
      event.target.pause();
  },
  videoEnded: function () {
    var index; 
    var player = this.props.player;
    var activeTag = this.state.active; 
    var start = this.state.start; 
    var end = this.state.end;
    if (this.state.index === this.state.plays.length-1)
      index = 0;
    else
      index = parseInt(this.state.index) + 1; 
    this.setState({
      index: index
    }, ()=> {
      if (activeTag !== "")
        browserHistory.push(player['slug'] + `?start=${start}&end=${end}&tag=${activeTag}&video=${index}`);
      else
        browserHistory.push(player['slug'] + `?start=${start}&end=${end}&video=${index}`);
    });
  }, 
  videoStream: function () {
    var mp4s = this.state.plays; 
    if (mp4s.length)
      return (
        <video id = "stream_frame" 
               className="video" 
               onClick={this.control} 
               onEnded={this.videoEnded} 
               autoPlay={true} 
               controls = {false} 
               src={this.state.plays[this.state.index]['mp4']} 
               muted={false}/>
      )
    else
      return (
        <div className="videoBlack">
          <p>No videos for this segment</p>
        </div>
      )
  }, 
  tagStream: function () {
    return (this.generateTags(this.state.tags));
  },
  activateFilter: function (event) {
    var tag = event.props.tag;
    var flag = (this.state.active === tag); 
    if (flag) {
      this.setState({
        index: 0,
        active: "", 
        plays: this.fetchMP4s()
      }, () => {

      })
    } else {
      var player = this.props.player;
      var start = this.state.start; 
      var end = this.state.end;
      this.setState({
        index: 0,
        active: tag, 
        plays: this.filterPlays(tag)
      }, ()=> {
          browserHistory.push(player['slug'] + `?start=${start}&end=${end}&tag=${tag}&video=${1}`);
      })
    }
  },
  generateTags: function (tags) {
    var elements = tags.map((tag) => {
      return (
        <Tag tag={tag}
             active={this.state.active === tag}
             activateFilter={this.activateFilter}
             key={Math.random()}
        />
      )
    });
    var content;
    if (elements.length || this.fetchTags().length) {
      content = (
        <div>
          <h4>Refine search</h4>
          <div className="padding">
            <input className="tag-search" type="text" name="filterplayer" value={this.state.tagSearchValue} onChange={this.handleChange} placeholder={"Search a tag"}/>
          </div>
          { elements }
        </div>
      )
    } else {
      content = (
        <h4>No tags available</h4>
      )
    }

    return (
      <div className = "tagList">
        { content }
      </div>
    )
  },
  bodyBlock: function () {
    var slider = this.generateSlider();
    var videoStream = this.videoStream();
    var tagStream = this.tagStream();
    return (
      <div style = {{margin: "10px 0px"}}>
        <div className="bg-back">{(videoStream) ? videoStream : <p>Scrubbing</p>}</div>
        { slider }
        { tagStream }
      </div>
    )
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

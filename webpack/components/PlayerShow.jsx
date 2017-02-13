import Moment from 'moment';
import { extendMoment } from 'moment-range';
import React, { PropTypes } from 'react';
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
    prependedArguments: React.PropTypes.string
  },
  getInitialState: function () {
    return ({
      start: 0,
      end: this.props.games.length-1,
      active: "",
      index: 0,
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
        console.log(tags_filtered);
      }

      this.setState({
        tags: tags_filtered
      });
    });
  }, 
  componentDidMount: function () {
    this.setState({
      start: 0,
      end: this.props.games.length-1,
      active: "",
      index: 0,
      tags: this.fetchTags(), 
      plays: this.fetchMP4s()
    })
  }, 
  headerBlock: function () {
    var player = this.props.player;
    return (
      <div>
        <h1>{`${player.firstName} ${player.lastName}`}</h1>
        <h4>{`${player.heightFeet}'${player.heightInches} ${player.posExpanded} for ${player.citys[0]}`}</h4>
      </div>
    );
  },
  generateDatesOfGames: function () {
    var dates = _.map(this.props.games, (event)=> {
      return {
        day: event.day,
        month: event.month,
        year:event.year,
        id: event.day + " " + event.month + " " + event.year,
        date_object: new Date(event.year, event.month-1, event.day).toDateString()
      }
    });

    return (dates);
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
    this.setState({
      start: elems[0],
      end: elems[1]
    }, () => {
      this.setState({
        active: "",
        plays: this.fetchMP4s(),
        tags: this.fetchTags()
      })
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
    var dates = _.uniq(this.generateDatesOfGames())
    var marks = this.generateMarks(dates)
    var slider_props = {
        allowCross: false,
        pushable: false,
        min: 0,
        max: dates.length-1,
        defaultValue: [0,dates.length],
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
    if (this.state.index === this.state.plays.length-1)
      index = 0;
    else
      index = this.state.index + 1; 

    this.setState({
      index: index
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
               autoPlay={(this.state.index !== 0)} 
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
      })
    } else {
      this.setState({
        index: 0,
        active: tag, 
        plays: this.filterPlays(tag)
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

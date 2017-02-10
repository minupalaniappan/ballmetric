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
      tags: this.fetchTags([0, this.props.games.length]), 
      mp4s: this.fetchMP4s(null, [0, this.props.games.length])
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
  fetchTags: function (elems) {
    var game_capture = this.props.games.slice(elems[0], elems[1]);
    var plays = this.getPlays(game_capture);
    var tagLays = [];
    plays.forEach((play) => {
      if (play['playermap']) {
        play['playermap'].forEach((player)=> {
          if (player['id'] === this.props.player['id']) {
            tagLays.push(FetchTagObject(player['tags'])); 
          }
        });
      }
    });
    return (tagLays);
  }, 
  fetchMP4s: function (dummy, elems) {
    var game_capture = this.props.games.slice(elems[0], elems[1]);
    var plays = this.getPlays(game_capture);
    plays = plays.filter((play) => {
      return (_.contains(_.pluck(play['playermap'], 'id'), this.props.player['id']))
    });
    return (_.pluck(plays, 'mp4'));
  },
  dateListener: function (event, elems) {
    this.setState({
      mp4s: this.fetchMP4s(null, elems),
      tags: this.fetchTags(elems)
    })
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
  bodyBlock: function () {
    var slider = this.generateSlider();
    return (
      <div>{ slider }</div>
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

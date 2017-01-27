import React, { PropTypes } from 'react';
import _ from 'underscore';
import DateRange from 'date-range-js'
import Slider, { Range, Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
const Tag = require('./Tag.jsx').default
const Stream = require('./Stream.jsx').default

const PlayerShow = React.createClass({
  propTypes: {
    events: React.PropTypes.array,
    name: React.PropTypes.string,
    position: React.PropTypes.string,
    team: React.PropTypes.string,
    assortedTags: React.PropTypes.array, 
    assortedTagsInDictionary: React.PropTypes.object, 
    prependedArguments: React.PropTypes.string, 
    url: React.PropTypes.string
  },
  getInitialState: function () {
    return ({
      plays: this.props['events'],
      activeTags: [], 
      availableTags: this.getUniqArr(this.props.assortedTags)
    })
  }, 
  destroyVideo: function () {
    var stream = document.getElementById('stream_frame');
    stream.pause();
    stream.src =""; // empty source
    stream.load();
  }, 
  fetchPlaysUniqueTags: function () {
    var playstags = _.uniq(_.flatten(_.pluck(this.state['plays'], 'tags')));
    return (playstags);
  }, 
  getUniqArr: function (arr) {
    return (_.uniq(_.pluck(arr, 'value')));
  },
  fetchPlays: function () {
    this.setState({
      plays: this.filterPlays(this.state.activeTags)
    });
  },
  filterPlays: function (args) {
    if (args.length) {
      var returned_events = this.state.plays.map((play_) => {
        if (_.intersection(play_['tags'], args).length === args.length) {
          return (play_); 
        }
      });
      returned_events = returned_events.filter(Boolean)
      return (returned_events);
    } else {
      return (this.props['events']);
    }
  }, 
  tagListener: function (event) {
    var tag_value = event.target.getAttribute('value'); 
    if (tag_value === 'RESET') {
      this.setState({
          activeTags: [],
          availableTags: this.getUniqArr(this.props.assortedTags)
      }, () => {
        this.fetchPlays(); 
      });
    } else {
      var new_tag_set = this.state.activeTags;
      new_tag_set.push(tag_value);
      this.setState({
          activeTags: new_tag_set,
          availableTags: this.fetchAvailableTags(new_tag_set)
      }, () => {
        this.fetchPlays(); 
      });
    }
  }, 
  fetchAvailableTags: function (args) {
    var distinct_tags = _.filter(this.props.assortedTags, (elem) =>{ 
      return (!args.includes(elem['value'])) 
    });

    distinct_tags = this.getUniqArr(distinct_tags);
    return (distinct_tags); 
  }, 
  buildTags: function () {
    var raw_tags = this.props.assortedTagsInDictionary;
    var total_props_tags = this.getUniqArr(this.props.assortedTags);
    var tags = total_props_tags.map((title) => {
      var flag = (this.state.activeTags.length && !this.state.availableTags.includes(title)) ? true : false
      var tagEnabled = this.fetchPlaysUniqueTags();//.includes(tag_['value']); 
      var disable_flag = (_.indexOf(tagEnabled, title) == -1) ? true : false
      return (
        <Tag key = {Math.random()} disabled = {disable_flag} title = {title} active = {flag} changeFilter = {this.tagListener}/>
      )
    }); 
    tags = tags.filter((tag) => {
      return (!tag.props.disabled)
    });
    return (tags); 
  }, 
  componentDidMount: function () {
    if (this.props.prependedArguments) {
      var mappedElems = this.props.prependedArguments.split("-"); 
      var args = mappedElems.map((elem) => {
        return (this.props.assortedTagsInDictionary[elem]);
      });
      var avail_tags = this.fetchAvailableTags(args); 
      var obj = {
        activeTags: args,
        availableTags: avail_tags, 
      }

      this.setState(obj,()=> {
        this.fetchPlays()
      });
    } else {
      this.fetchPlays();
    } 
  },
  back: function () {
    this.destroyVideo(); 
    window.location.href = "/players/"; 
  }, 
  convertActiveTagsToURL: function () {
    var dict = this.props.assortedTags;
    var notation = this.state.activeTags.map((element) => {
      var emptyVal; 
      dict.forEach((valToCompare) => {
        if (!emptyVal && element === valToCompare['value']) {
          emptyVal = valToCompare['type']
        }
      });
      return emptyVal;
    });

    return notation;
  }, 
  dateListener: function (event, elems) {
    var start_obj = event[elems[0]];
    var end_obj = event[elems[1]];
    var startDate = new Date(start_obj.year, start_obj.month, start_obj.day);
    var endDate = new Date(end_obj.year, end_obj.month, end_obj.day);
    var range = new DateRange(startDate, endDate);
    var events = this.props.events.filter((play) => {
      var date = new Date (play.year, play.month, play.day); 
      return (range.contains(date))
    }); 
    this.setState({
      plays: events,
      activeTags: [],
      availableTags: this.getUniqArr(this.props.assortedTags)
    });
  },
  buildTimeSlider: function () {
    var dates = _.map(this.props.events, (event)=> {
      return {
        day: event.day,
        month: event.month,
        year:event.year,
        id: event.day + " " + event.month + " " + event.year,
        date_object: new Date(event.year, event.month, event.day).toDateString()
      }
    });
    var uniq_dates = _.uniq(dates, function(date){
        return date.id;
    });
    var slider_props = {
        allowCross: false,
        pushable: false,
        min: 0, 
        max: uniq_dates.length-1, 
        defaultValue: [0,uniq_dates.length],
        onChange: this.dateListener.bind(null, uniq_dates),
        handle: (props) => {
          const { value, dragging, index } = props;
          return (
            <Tooltip
              overlay={uniq_dates[value]['date_object']}
              visible={dragging}
              placement="top"
              key={index}
            >
              <Handle {...props} />
            </Tooltip>
          );
      }
    }
    var slider_date = (
      <div>
        <Range {...slider_props}/>
      </div>  
    );

    return slider_date;
  },
  render: function() { 
    var slider = this.buildTimeSlider();
    var tags = this.buildTags();
    var reset = (this.state.activeTags.length) ? (<Tag key = {Math.random()} disabled = {false} title = {'RESET'} active = {true} changeFilter = {this.tagListener}/>) : null
    return (
      <div>
        <div>
          <a onClick = {this.back} href = "/players/"><p className="primary padding margin" style = {{fontSize: 1 + "em"}}>View a different player</p></a>
          <div className = "padding margin">
            <h2 className = "header spacing_none">{this.props.name}</h2>
            <h4 className="description">{this.props.position + " for the " + this.props.team}</h4>
          </div>
          <div>
            <div><Stream streamables = {this.state.plays}
                    index = {0} key = {Math.random()} name = {this.props.name} tagsToPush = {this.convertActiveTagsToURL(this.state.activeTags)} totalUrl = {this.props.url}/></div>
            { slider }
            <div className="padding">
              { reset }
            </div>
            <div className = "max-width-video parent">
              {tags}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default PlayerShow;
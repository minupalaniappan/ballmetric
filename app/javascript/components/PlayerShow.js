import React, { PropTypes } from 'react';
import Tag from './Tag'
import Stream from './Stream'
import _ from 'underscore';
import Slide from 'rc-slider';


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
    if (tag_value === 'Reset') {
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

    return (tags); 
  }, 
  divideTags: function (arr, flag) {
    var tags = arr.map((elem) => {
      if (elem.props.active === flag)
        return elem;
    }).filter(Boolean);
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
        availableTags: avail_tags
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
  render: function() { 
    var tags = this.buildTags();
    var active_tags = this.divideTags(tags, true);
    var active_tags_elem = (active_tags.length) ? (<div>{active_tags}</div>) : (<div><p className="description">{"Click on a play type below"}</p></div>)
    var available_tags = this.divideTags(tags, false);
    var reset = (active_tags.length) ? (<div><Tag key = {Math.random()} disabled = {false} title = {'Reset'} active = {true} changeFilter = {this.tagListener}/></div>) : null
    return (
      <div>
        <div>
          <a onClick = {this.back} href = "/players/"><p className="primary" style = {{fontSize: 1.1 + "em"}}>View a different player</p></a>
          <p className = "header spacing_none">{this.props.name}</p>
          <p className="description">{this.props.position + " for the " + this.props.team}</p>
          <div><Stream streamables = {this.state.plays}
                  index = {0} key = {Math.random()} name = {this.props.name} tagsToPush = {this.convertActiveTagsToURL(this.state.activeTags)} totalUrl = {this.props.url}/></div>
          <div className = "max-width-video">
            <div name="active">
              <p>Active tags</p>
              <div>{active_tags_elem}</div>
              <div>{reset}</div>
            </div>
            <div name="avail">
              <p>Available tags</p>
              <div>{available_tags}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default PlayerShow;
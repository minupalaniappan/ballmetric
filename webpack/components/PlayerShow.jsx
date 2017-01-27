import React, { PropTypes } from 'react';
import _ from 'underscore';
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
    var active_tags_elem = (active_tags.length) ? (<div>{active_tags}</div>) : (<div><p className="description">{"Currently no filters"}</p></div>)
    var available_tags = this.divideTags(tags, false);
    var reset = (active_tags.length) ? (<Tag key = {Math.random()} disabled = {false} title = {'RESET'} active = {true} changeFilter = {this.tagListener}/>) : null
    var active_tag_comp = (active_tags.length) ? (
       <div>
          <h4 className = "center padding">Active tags</h4>
          <div className="padding-side">{active_tags_elem}</div>
          <div>{reset}</div>
        </div>
    ) : null; 

    return (
      <div>
        <div>
          <a onClick = {this.back} href = "/players/"><p className="primary padding margin" style = {{fontSize: 1 + "em"}}>View a different player</p></a>
          <div className = "padding margin">
            <h2 className = "header spacing_none">{this.props.name}</h2>
            <h4 className="description">{this.props.position + " for the " + this.props.team}</h4>
          </div>
          <div className = "table-header">
            <div className = "inline parent"><Stream streamables = {this.state.plays}
                    index = {0} key = {Math.random()} name = {this.props.name} tagsToPush = {this.convertActiveTagsToURL(this.state.activeTags)} totalUrl = {this.props.url}/></div>
            <div className = "max-width-video inline vert-top parent">
              { active_tag_comp }
              <div name="avail" className = "margin-side">
                <h4 className = "center padding">Available tags</h4>
                <div className="padding-side">{available_tags}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default PlayerShow;
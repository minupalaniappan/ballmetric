import React, { PropTypes } from 'react';
var PlayerList = React.createClass({
  getInitialState: function () { 
    return ({
      players: [], 
      value: ''
    })
  },
  buildPlayerList: function () {
    var players_to_render = this.state.players; 
    var components = players_to_render.map((player) => {
      var args = {
        start: 0, 
        end: 81,
        tag: "All",
        videoId: 0, 
        playerId: parseInt(player['id'])
      }
      if (player) {
        return (
          <div key = {Math.random()} className = "padding">
            <a href={"players/" + encodeURIComponent(player.slug) + "?" + $.param(args)}><h2 className = "inline">{player.firstName} {player.lastName}</h2><h4 className="description inline" style = {{marginLeft: "5px"}}>{player.pos}</h4></a>
          </div>
        )
      }
    });

    return (components);
  },
  handleChange: function (event) {
    var state = this;
    var text = event.target.value;
    state.setState({
      value: text
    }, () => {
      $.getJSON('/api/v1/players/fetchPlayers?query=' + text, function(data) {
          state.setState ({
            players: data['players']
          })
      });
    });
  }, 
  render: function() {
    var players_component = this.buildPlayerList(); 
    return (
      <div className="playerListWrapper">
        <h1 className="center" style={{textAlign: "center"}}>Ballmetric</h1>
        <h4 className="center light" style = {{textAlign: "center"}}>Discover new plays from the NBA</h4>
        <div className="padding">
          <input className="form-search" type="text" name="filterplayer" value={this.state.value} onChange={this.handleChange} placeholder={"Search a player"}/>
        </div>
        <div className="player_component">{players_component}</div>
      </div>
    );
  }
});

export default PlayerList

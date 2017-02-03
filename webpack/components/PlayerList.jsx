import React, { PropTypes } from 'react';
var PlayerList = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    players: React.PropTypes.array
  },
  getInitialState: function () { 
    return ({
      players: [], 
      value: ''
    })
  },
  buildPlayerList: function () {
    var players_to_render = this.state.players; 
    var components = players_to_render.map((player) => {
      if (player) {
        return (
          <div key = {Math.random()} className = "padding">
            <a href={player.url}><h2>{player.firstname} {player.lastname}</h2></a>
            <h4 className="description">{player.position} for the {player.team}</h4>
          </div>
        )
      }
    });

    return (components);
  },
  handleChange: function (event) {
    var text = event.target.value;
    var all_players = this.props['players'];
    this.setState({
      value: text, 
    }, () => {
      var players_filtered = all_players.map((player) => {
        var search_str = player.firstname + " " + player.lastname + " " 
        + player.team + " " + player.position;
        if (search_str.search(new RegExp(text, "i")) != -1) {
          return player;
        }
      });

      if (this.state.value === "")
        players_filtered = [];

      this.setState({
        players: players_filtered
      });
    });
  }, 
  render: function() {
    var players_component = this.buildPlayerList(); 
    return (
      <div className="playerListWrapper">
        <h1 className="center">{this.props.title}</h1>
        <h4 className="center light">Bringing shot search to the National Basketball Association</h4>
        <div className="padding">
          <input className="form-search" type="text" name="filterplayer" value={this.state.value} onChange={this.handleChange} placeholder={"Search a player"}/>
        </div>
        <div className="player_component">{players_component}</div>
      </div>
    );
  }
});

export default PlayerList

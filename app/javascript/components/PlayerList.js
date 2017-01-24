import React, { PropTypes } from 'react';
const PlayerList = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    players: React.PropTypes.array
  },
  getInitialState: function () {
    return ({
      players: this.props['players'], 
      value: ''
    })
  },
  buildPlayerList: function () {
    var players_to_render = this.state.players; 
    var components = players_to_render.map((player) => {
      if (player) {
        return (
          <div key = {Math.random()}>
            <a href={player.url}><p className="primary">{player.firstname} {player.lastname}</p></a>
            <p className="description">{player.position} for the {player.team}</p>
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

      this.setState({
        players: players_filtered
      });
    });
  }, 
  render: function() {
    var players_component = this.buildPlayerList(); 
    return (
      <div>
        <p className="header">{this.props.title}</p>
        <input className="form-search" type="text" name="filterplayer" value={this.state.value} onChange={this.handleChange} placeholder={"Search a player"}/>
        {players_component}
      </div>
    );
  }
});

export default PlayerList;
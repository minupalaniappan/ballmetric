import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
const PlayerList = require('./PlayerList.jsx').default
const PlayerShow = require('./PlayerShow.jsx').default


var driverFunction = function (page) {
	switch (page) {
		case "player_list_data":
			ReactDOM.render(<PlayerList />, document.getElementById('playerlist'));
			break; 
		case "player_show_data": 
			var PlayerShowProps = {
				player: window.object.player,
				prependedArguments: window.object.prependedArguments,
			}
			ReactDOM.render(<PlayerShow {...PlayerShowProps}/>, document.getElementById('playershow'));
			break;
		default:
			break;
	}
}

var DriverClass = {
	execute: () => {
		driverFunction(document.getElementsByClassName("none")[0].id) 
	}
}

export default DriverClass
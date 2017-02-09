import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';

const PlayerList = require('./PlayerList.jsx').default
const PlayerShow = require('./PlayerShow.jsx').default


var driverFunction = function (page) {
	switch (page) {
		case "player_list_data":
			var PlayerListProps = {
				title: "Ballmetric", 
				players: window.object.players
			}
			ReactDOM.render(<PlayerList {...PlayerListProps} />, document.getElementById('playerlist'));
			break; 
		case "player_show_data": 
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
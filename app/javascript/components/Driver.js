import ReactDOM from 'react-dom';
import React, { PropTypes } from 'react';
import PlayerList from './PlayerList';
import PlayerShow from './PlayerShow';

export var driverFunction = function (page) {
	switch (page) {
		case "player_list_data":
			var PlayerListProps = {
				title: "Ballmetric", 
				players: window.object.players
			}
			ReactDOM.render(<PlayerList {...PlayerListProps} />, document.getElementById('playerlist'));
			break; 
		case "player_show_data": 
			var PlayerShowProps = {
				name: window.object.name,
				team: window.object.team, 
				assortedTags: window.object.assortedTags, 
				assortedTagsInDictionary: window.object.assortedTagsInDictionary, 
				prependedArguments: window.object.prependedArguments, 
				url: window.object.url,
				events: window.object.events
			}
			ReactDOM.render(<PlayerShow {...PlayerShowProps} />, document.getElementById('playershow'));
			break;
		default:
			break;
	}
}

driverFunction(document.getElementsByClassName("none")[0].id);
class PlayersController < ApplicationController
	def index
		ActiveRecord::Base.include_root_in_json = true
		_players = Player.all
		_players = _players.as_json
		_players_wUrl = _players.map {
			|player|
			player = player['player']
			player['url'] = Player.where(urlName: player['urlName'])[0].base_uri
			player
		}

		@props = {
			title: "Ballmetric",
			players: _players_wUrl 	
		}.to_json
	end

	def show
	end

end

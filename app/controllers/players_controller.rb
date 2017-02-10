class PlayersController < ApplicationController

	def mapArr (arr)
		return (arr.map {
			|elem|
			elem.attributes
		})
	end
	
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
		ActiveRecord::Base.include_root_in_json = true
		@urlArgs = params['q'].to_s
		player = Player.friendly.find(params[:id])
		_games = Game.where('home_team=? OR away_team=?', player['teams'][0], player['teams'][0])
		_plays = _games.map {
			|game|
			game.plays
		}[0]
		@props = {
			player: player.attributes,
			games: mapArr(_games), 
			plays: mapArr(_plays),
			prependedArguments: @urlArgs
		}.to_json
	end

end

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
			player['url'] = Player.where(urlName: player['urlName'])[0].base_uri + "?video=1"
			player
		}

		@props = {
			title: "Ballmetric",
			players: _players_wUrl 	
		}.to_json
	end

	def show
		ActiveRecord::Base.include_root_in_json = true
		player = Player.friendly.find(params[:id])
		_games = Game.where('home_team=? OR away_team=?', player['teams'][0], player['teams'][0])
		playArr = Array.new
		_games.each {
			|game|
			game.plays.each {
				|play|
				playArr.push play
			}
		}
		if params[:type] == nil
			params[:type] = ""
		end
		if params[:start] == nil
			params[:start] = ""
		end
		if params[:end] == nil
			params[:end] = ""
		end
		@props = {
			player: player.attributes,
			games: mapArr(_games), 
			plays: mapArr(playArr),
			prependedArguments: [params[:type], params[:video]],
			dates: [params[:start], params[:end]]
		}.to_json
		puts @props
	end

end

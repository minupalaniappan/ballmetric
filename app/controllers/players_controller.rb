class PlayersController < ApplicationController
	def index
		ActiveRecord::Base.include_root_in_json = true
		_players = Player.all
		_players = _players.as_json
		_players_subtitled = _players.map {
			|player|
			player = player['player']
			player['position'] = POSITIONS[player['position']]
			player['team'] = TEAMS[player['team']]
			player['url'] = Player.where(playerlowcase: player['playerlowcase'])[0].base_uri
			player
		}

		@props = {
			title: "Ballmetric",
			players: _players_subtitled 	
		}
	end

	def show
		@urlArgs = params['q'].to_s
		_player = Player.friendly.find(params[:id])
		@name = _player.firstname + " " + _player.lastname
		@position = _player.position
		@team = _player.team
		@playsToKeep = _player.plays.map{
			|play_| 
			tags_ = JSON.parse "#{play_.tags}"
			play_ = JSON.parse ({
				game_id: play_.game_id, 
				event_id: play_.event_id,
				away_team: play_.away_team, 
				home_team: play_.home_team,
				description: play_.description, 
				mp4: play_.mp4,
				month: play_.month,
				day: play_.day, 
				year: play_.year,
				tags: tags_
			}.to_json)
			play_
		}
		@props = {
			name: @name,
			position: POSITIONS[@position],
			team: TEAMS[@team],
			assortedTags: DICTION_arr,
			events: @playsToKeep,
			assortedTagsInDictionary: DICTION,
			prependedArguments: @urlArgs,
			url: request.original_url 	
		}
	end

	private
		def write_play (arr, player)
			arr.each {
				|_obj|
				if player.plays.exists?(game_id: _obj['game_id'], event_id: _obj['event_id'])
				else
					player.plays.create(_obj)
				end
			}
		end

		def write_player (player)
			if Player.exists?(playertag: player['playertag'], team: player['team'])
			else
				_sv = Player.new(player)
				if _sv.save
					logger.debug 'Added'
				else
					logger.debug _sv.errors.messages
				end
			end
		end
end

class Api::V1::PlayersController < ApplicationController

	def mapArr (arr)
		return (arr.map {
			|elem|
			elem.attributes
		})
	end

	def classifyTag (values)
		tag = case true
				when (['Jump', 'Shot'] & values).length == 2
					case true
						when (values.include? "3PT")
							then "3PT Jumpshot"
						when (values.include? "Pull-Up")
							then "Pull-up Jumpshot"
						when (values.include? "Back")
							then "Stepback Jumpshot"
						when (values.include? "Turnaround")
							then "Turnaround Jumpshot"
					end
				when (values.include? 'Hook')
					then "Hook shot"
				when (values.include? 'Fadeaway')
					then "Fadeaway Jumpshot"
				when (values.include? 'Floating')
					then "Floater"
				when (values.include? 'Shot' or values.include? 'Shot')
					then "Shot"
				when (values.include? 'REBOUND' or values.include? 'REB')
					then "Rebound"
				when (values.include? 'STEAL' or values.include? 'STL')
					then "Steal"
				when (values.include? 'TURNOVER' or 
									 values.include? 'TO' or
									 values.include? 'Traveling' or 
								  	 values.include? 'Bad') 
				  	 then "Turnover"
				when (values.include? 'DUNK' or values.include? 'Dunk')
					then "Dunk"
				when (values.include? 'ASSIST' or values.include? 'AST')
					then "Assist"
				when (values.include? 'Driving' or values.include? 'Running' or values.include? 'Layup')
					then "Layup"
				when (values.include? 'FT' or values.include? 'Freethrow')
					then "Free Throw"
				when (values.include? 'BLOCK' or values.include? 'BLO')
					then "Block"
				when (values.include? 'P.FOUL' or values.include? 'Foul' or
									 values.include? 'S.FOUL' or values.include? 'OFF.FOUL' or 
									 values.include? 'DEF.FOUL' or values.include? 'Foul')
					then "Foul"
				  end
		if (tag == "")
			tag = "Midrange jumper"
		end
		if (values.include? 'MISS')
			made = false
		elsif (tag != "Block" and 
					 tag != "Steal" and 
					 tag != "Assist" and 
					 tag != "Turnover" and 
					 tag != "Rebound")
			made = true;
		end
		return ({
			value: tag,
			made: made
		}.as_json)
	end

	def fetchPlayer
		player = Player.where(:slug => params[:slug]).first
		render json: {status: 'SUCCESS', message: 'Successful', player: player }, status: :ok
	end


	def fetchPlayers
		search_text = params[:query].downcase
		players = Player.all
		players = players.to_a.select {
			|player|
			fname = player['firstName'].downcase
			lname = player['lastName'].downcase
			fname.include? search_text or 
			lname.include? search_text or
			(fname + " " + lname).include? search_text
		}
		if search_text == ""
			players = []
		else
			players = mapArr players
		end
		render json: {status: 'SUCCESS', message: 'Successful', players: players}, status: :ok

	end

	def fetchGames
		player = Player.find params[:playerid]
		_start = params[:start].to_i
		_end = params[:end].to_i
		games = mapArr Game.where('home_team=? OR away_team=?', player['teams'][0], player['teams'][0]).select {
			|game|
			game.plays.to_a.length > 0
		}
		games = games.to_a.each_with_index.select{
			|game, idx|
			idx.between?(_start,_end)
		}
		render json: {status: 'SUCCESS', message: 'Successful', games: games}, status: :ok
	end

	def fetchPlay
		tagType = params[:tag]
		videoId = params[:videoId]
		player = Player.find(params[:playerId])
		_start = params[:start].to_i
		_end = params[:end].to_i
		games = Game.where('home_team=? OR away_team=?', player['teams'][0], player['teams'][0])
		tags = Play.joins(:game).where(:game_id => games).all.map {
			|play|
			mappedPlay = play.playermap.map { 
				|mp| 
				mp = mp.as_json
				tag = ""
				if mp['id'] == player['id']
					tag = classifyTag mp['tags']
				end
				tag
			}.first
			mappedPlay
		}.compact.uniq
		games = games.to_a[_start...(_end+1)]
		games_ids = games.pluck(:id)
		games_ids = games_ids.to_a[_start...(_end+1)]
		play = Play.joins(:game).where(:game_id => games_ids).all.select { 
			|play|  
			playermapId = play.playermap.select { 
				|mp| 
				mp = mp.as_json
				mp['id'] == player['id'] and (classifyTag(mp['tags'])['value'] == tagType or tagType == "")
			}
			playermapId.length > 0
		}.to_a
		if (videoId.to_i > play.length-1)
			render json: {status: 'ERROR', message: 'Index out of range', play: [], tags: []}, status: :ok
		elsif (play.length > 0)
			play = play[(videoId).to_i].attributes
			render json: {status: 'SUCCESS', message: 'Successful', play: play, tags: tags}, status: :ok
		else
			render json: {status: 'SUCCESS', message: 'Successful', play: [], tags: []}, status: :ok
		end
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
	end

end

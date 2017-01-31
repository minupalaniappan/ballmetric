class AssignplaysJob < ActiveJob::Base
  queue_as :default

  	def fetchPlays (game)
		game_id = game['game_id']
		root_url = "http://stats.nba.com/stats/playbyplayv2?EndPeriod=10&EndRange=55800&GameID=#{game_id}&RangeType=2&Season=2016-17&StartPeriod=1&StartRange=0"
		begin
		  data = JSON.parse(HTTP.get(root_url).to_s)
		  raise "parse error" if data.nil?
		rescue Exception => e
		end

		if data.nil?
		else
			return data
		end
	end

	def iteratePlays (content, game, player)
		content['resultSets'][0]['rowSet'].each {
			|element|
			plays = parsePlay element, game, player
		}
	end

	def generateTags (description, player)
		tokens = Array.new
		if description.length != 0
			arr_description = description.split(/[()]/)
			arr_description.each {
		        |splitText|
		        if splitText.include? player.lastname
		          tokens = splitText.split(/[\s,.']/)
		          tokens = tokens.map {
		            |token|
		            DICTION[token]
		          }
		        end
		    }
		end
		return tokens.compact.uniq
	end

	def fetchMP4 (eventid, gameid)
		uri = "http://stats.nba.com/stats/videoevents?GameEventID=#{eventid}&GameID=#{gameid}"
		response = JSON.parse(Excon.get(uri).body.to_s)
		idx = response['resultSets']['Meta']['videoUrls']
		if idx and idx[0]['stp']
			idx = response['resultSets']['Meta']['videoUrls'][0]['uuid']
			video_code = Excon.get("http://www.nba.com/video/wsc/league/#{idx}.xml").body.to_s.split('_')[3]
			if video_code == "151116"
				return (nil)
			end
			url = response['resultSets']['Meta']['videoUrls'][0]['stp'].split('_')[0]
			url = url + "_#{video_code}_" + "768x432_1500.mp4"
			return url
		else
			return (nil)
		end
	end

	def playerHasMP4 (player, link)
		return (player.plays.pluck(:mp4).include? link)
	end

	def parsePlay (play, game, player)
		plays = Array.new
		if play[14] == nil
			return nil 
		else
			play_ = Hash.new
			play_['game_id'] = play[0]
			play_['event_id'] = play[1].to_i
		    play_['month'] = game['month'].to_i
		    play_['day'] = game['day'].to_i
		    play_['year'] = game['year'].to_i
		    play_['away_team'] = game['away_team']
			play_['home_team'] = game['home_team']  

			playerName = "#{player['firstname']} #{player['lastname']}" 
			case playerName
			    when play[14] then
			    	play_['mp4'] = fetchMP4 play_['event_id'], play_['game_id']
			    	play_['description'] = if play[18] == game['home_team'] then play[7] else play[9] end
					play_['tags'] = generateTags play_['description'], player
					_recordplayer = @players.where(firstname: player['firstname'], 
								    lastname: player['lastname'],
								    team: player['team']).first

					if !playerHasMP4 _recordplayer, play_['mp4']
						_recordplayer.plays.create(play_['mp4'])
					end 

			    when play[21] then
			    	play_['mp4'] = fetchMP4 play_['event_id'], play_['game_id']
			    	play_['description'] = if play[25] == game['home_team'] then play[7] else play[9] end
					play_['tags'] = generateTags play_['description'], player
					_recordplayer = @players.where(firstname: player['firstname'], 
								    lastname: player['lastname'],
								    team: player['team']).first

					if !playerHasMP4 _recordplayer, play_['mp4']
						_recordplayer.plays.create(play_['mp4'])
					end 

		        when play[28] then
		        	play_['mp4'] = fetchMP4 play_['event_id'], play_['game_id']
		        	play_['description'] = if play[32] == game['home_team'] then play[7] else play[9] end
					play_['tags'] = generateTags play_['description'], player
					_recordplayer = @players.where(firstname: player['firstname'], 
								    lastname: player['lastname'],
								    team: player['team']).first

					if !playerHasMP4 _recordplayer, play_['mp4']
						_recordplayer.plays.create(play_['mp4'])
					end 

			    else
			    	play_['description'] = nil 
			    	play_['tags'] = nil 
			end
		end
	end

  	def perform(game, player)
   	 	# Do something later
	    data = fetchPlays game
	   	iteratePlays data, game, player
  	end
end

class PlayJob < ActiveJob::Base
	@queue = :default
	def self.fetchPlayIds (game)
		game_id = game['game_id']
		itr = 2
		error_itr = 0

		begin 
			play = HTTP.get("http://stats.nba.com/stats/videoevents?GameEventID=#{itr}&GameID=#{game_id}").parse
			playHash = Hash.new
			playHash['event_id'] = itr
			if play['resultSets']['playlist'].length > 0
				playHash['description'] = play['resultSets']['playlist'][0]['dsc']
				playHash['mp4'] = fetchURL(play)
				playHash['playermap'] = []
				if playHash['mp4'] != "" and playHash['mp4'] != nil
					begin
					  game.plays.create(playHash)
					  puts playHash
					rescue ActiveRecord::RecordNotUnique => e 
						puts e
					end
				end
			end
			if (play['resultSets']['Meta']['videoUrls'].length == 0 and play['resultSets']['playlist'].length == 0)
				error_itr = error_itr + 1
			else
				error_itr = 0
			end
			itr = itr + 1
		end until (error_itr > 5)
	end

	def self.fetchURL (play)
		if (play['resultSets']['Meta']['videoUrls'].length != 0 and play['resultSets']['playlist'].length != 0)
			uuid = play['resultSets']['Meta']['videoUrls'][0]['uuid']
			urlResponse = play['resultSets']['Meta']['videoUrls'][0]['stp']
			playList = play['resultSets']['playlist'][0]
			video_code = HTTP.get("http://www.nba.com/video/wsc/league/#{uuid}.xml").to_s.split('_')[3]
			puts video_code
			if video_code == "151116" and urlResponse != nil
				return ("")
			end
			if urlResponse != nil
				url = urlResponse.split "_"
				url = url[0] + "_#{video_code}_" + "768x432_1500.mp4"
				return url
			end
		end
	end

	def self.fetchTags (desc, name_)
		specialChars = ["#", "@"]
		desc_arr = desc.split(/[()]/)
		desc_arr.each {
			|token|
			if token.include? name_
				tags_arr = token.split(/[\s,']/)
				tags_arr.delete_if { |a| a == "" or a == name_ or specialChars.any? { |spe| a.include?(spe) } }
				return tags_arr
			end
		}
		return []
	end

	def self.assignPlayers (game)
		home_roster = Roster.find_by(name: game['home_team']).players
		away_roster = Roster.find_by(name: game['away_team']).players
		game.plays.each {
			|play|
			playermap = Array.new
			desc = play['description']
			home_roster.each {
				|player|
				if desc.include? player['lastName']
					tags_arr = fetchTags desc, player['lastName']
					player_obj = {
						id: player['id'],
						tags: tags_arr
					}
					playermap.push(player_obj)
				end
			}
			away_roster.each {
				|player|
				if desc.include? player['lastName']
					tags_arr = fetchTags desc, player['lastName']
					player_obj = {
						id: player['id'],
						tags: tags_arr
					}
					playermap.push(player_obj)
				end
			}
			play.update(:playermap => playermap)
			
		}
	end

	def self.driver (game)
		fetchPlayIds game
	end

	def perform(game)
   	 	# Do something later
   	 	fetchPlayIds game
  	end
end
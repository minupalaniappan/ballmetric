class PlayerJob < ActiveJob::Base
	def self.fetchPlayers
		data = HTTP.get('http://www.nba.com/players/active_players.json').parse
		return data
	end

	def self.assignPlayer (player)
		acr = player['teamData']['tricode']
		team = Roster.find_by(name: acr)
		player_obj = Hash.new
		player_obj['firstName'] = player['firstName']
		player_obj['lastName'] = player['lastName']
		player_obj['pos'] = player['pos']
		player_obj['posExpanded'] = player['posExpanded']
		player_obj['heightFeet'] = player['heightFeet'].to_i
		player_obj['heightInches'] = player['heightInches'].to_i
		player_obj['weightPounds'] = player['weightPounds'].to_i
		player_obj['personId'] = player['personId'].to_i
		player_obj['isAllStar'] = player['isAllStar']
		player_obj['orderChar'] = player['orderChar']
		player_obj['displayName'] = player['displayName']
		player_obj['urlName'] = acr + player['displayName']
		team.players.create!(player_obj)
	end

	def self.addTeamToPlayer
		data = fetchPlayers
		data.each {
			|player|
			if player['playerId']
				ply = Player.find_by(personId: player['personId'].to_i)[0]
				ply.update(:teams => [player['teamData']['tricode']])
			end
		}
	end

	def self.driver 
		content = fetchPlayers
		content.each {
			|player|
			assignPlayer player
		}
	end

end
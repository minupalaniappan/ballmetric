class RosterJob < ActiveJob::Base
	def self.fetchAcronyms
		@games = Game.all
		@games_array = Array.new
		@games.each {
			|game|
			@games_array.push game['home_team'], game['away_team']
		}
		@games_array = @games_array.uniq
		return @games_array
	end

	def self.write_team (team)
		if Roster.exists?(name: team)
		else
			_sv = Roster.new({ :name => team})
			if _sv.save
				puts 'Added'
			else
				puts _sv.errors.messages
			end
		end
	end

	def self.driver 
		content = fetchAcronyms
		content.each {
			|block|
			write_team block
		}
	end
end
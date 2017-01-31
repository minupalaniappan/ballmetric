namespace :fetch_plays do
	task :access => :environment do 
		@players = Player.all
		@GAMES = Game.all
		@players.each {
	    	|player|
	    	puts player
	    	games = findMissingGames player, @GAMES
	    	if games != nil
		    	games.each {
		    		|game|
		    		AssignplaysJob.perform_later(game, player) 
		    	}
		    end
	    }
	end

	def findMissingGames (player, games)
  		if player.plays.length != 0
	  		startDate = Date.new(player.plays.first['year'],
	  				 player.plays.first['month'],
	  				 player.plays.first['day']) + 1
	  		endDate = Date.today-2
	  		filtered_games = games.where(month: startDate.mon..endDate.mon, year: startDate.year..endDate.year, day: startDate.mday..endDate.mday)
  			if filtered_games.length != 0
  				filtered_games = filtered_games.where('home_team= ? OR away_team= ?', player['team'], player['team'])
  				return filtered_games
  			end
  		end
  	end
end

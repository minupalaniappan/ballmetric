namespace :fetch_plays do
	task :access => :environment do 
		players = Player.all
		@GAMES = Game.all
		players.each {
			|player|
			games = findMissingGames player, @GAMES
	    	if games != nil
		    	games.each {
		    		|game|
		    		AssignplaysJob.perform_later game[0], player
		    	}
		    end
		}
	end

	def findMissingGames (player, games)
  		if player.plays.length != 0
	  		startDate = Date.new(2017,1,1) + 1
	  		endDate = Date.today-2
	  		@games_arr = Array.new
	  		(startDate..endDate).to_a.each {
	  			|date|
	  			game = games.where('home_team= ? OR away_team= ?', player['team'], player['team']).where(year: date.year, month: date.mon, day: date.mday)
	  			if game.length > 0
	  				@games_arr.push game
	  			end												
	  		}
  		end
  		return @games_arr
  	end
end

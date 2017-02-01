namespace :fetch_plays do
	task :access => :environment do 
		player = Player.find(1)
		@GAMES = Game.all
		games = findMissingGames player, @GAMES
    	if games != nil
	    	games.each {
	    		|game|
	    		Resque.enqueue(AssignplaysJob, game[0], player)
	    	}
	    end
	end

	def findMissingGames (player, games)
  		if player.plays.length != 0
	  		startDate = Date.new(player.plays.first['year'],
	  				 player.plays.first['month'],
	  				 player.plays.first['day']) + 1
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

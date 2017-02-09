class GameJob < ActiveJob::Base
	def fetchDate 
		_games = Array.new
		Date.new(2016, 10, 25).upto(Date.new(2017, 05, 29)) do |date|
		  day = date.mday.to_s.rjust(2, "0")
		  month = date.month.to_s.rjust(2, "0")
		  year = date.year

		  new_games = fetch_regular_season_games day, month, year
		  	if new_games.length > 0
				new_games.each {
				  	|game|
				  	puts game
				  	_games.push game
				}
		  	end
		end
		return _games
	end
	def fetch_regular_season_games (day, month, year)
		link = "http://data.nba.net/data/10s/prod/v1/#{year}#{month}#{day}/scoreboard.json"
		begin
		  content = JSON.parse(HTTP.get(link).to_s)
		  raise "parse error" if content.nil?
		rescue Exception => e
		end
		games = Array.new
		if content and content['numGames'].to_i > 0
			content['games'].each {
				|_each|
				game_hash = Hash.new
				game_hash['away_team'] = _each['vTeam']['triCode']
				game_hash['home_team'] = _each['hTeam']['triCode']
				game_hash['season'] = _each['seasonStageId']
				game_hash['month'] = month
				game_hash['day'] = day
				game_hash['year'] = year
				game_hash['game_id'] = _each['gameId']
				games.push game_hash
			}
		end
		return games
	end
	def write_game (game)
		if Game.exists?(game_id: game['game_id'])
		else
			_sv = Game.new(game)
			if _sv.save
				puts 'Added'
			else
				puts _sv.errors.messages
			end
		end
	end
	def execute
		_games = fetchDate
		_games.each {
			|game|
			write_game game
		}
	end

	def perform
   	 	# Do something later
	    execute
  	end
end
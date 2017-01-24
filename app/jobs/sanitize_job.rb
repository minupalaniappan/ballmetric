class SanitizeJob < ActiveJob::Base
  queue_as :default

  def determineId(players, description, tags)
    id = 0 
    description_split = description.split(/[()]/).to_a
    players.each {
      |player|
      description_split.each {
        |splitText|
        if splitText.include? player.lastname
          tokens = splitText.split(/[\s,.']/)
          tokens = tokens.map {
            |token|
            DICTION[token]
          }
          tags = JSON.parse(tags.to_s)
          if (tags-tokens).empty?
            return player['id']
          end
        end
      }
    }
  end

  def fetchPlayerIds(teams, description, players)
  	arr_description = description.split(/[\s(),.']/)
  	return (players.where(team: teams).where(lastname: arr_description))
  end

  def iterPlay (plays, players)
    @CONSTPLAYERS = players
  	plays.each {
  		|play|
  		home_team = play.home_team
  		away_team = play.away_team
  		tags = play.tags 
  		description = play.description
  		players = fetchPlayerIds [home_team, away_team], description, @CONSTPLAYERS
      id = determineId players, description, tags
      play['player_id'] = id
      play.save
  	}
  end

  def perform(*args)
    # Do something later
    plays = args[0].order('id ASC').all 
    players = args[1]
    iterPlay plays, players
  end

end

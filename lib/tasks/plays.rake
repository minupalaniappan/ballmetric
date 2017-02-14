namespace :plays do
	task :fetch => :environment do
		#games = Game.where(:id => 51..151)
		games = Game.all
		games.each {
			|game|
			PlayJob.assignPlayers game
		}
	end
end
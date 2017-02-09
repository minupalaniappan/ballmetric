namespace :plays do
	task :fetch => :environment do
		games = Game.all
		games.each {
			|game|
			PlayJob.assignPlayers game
		}
	end
end
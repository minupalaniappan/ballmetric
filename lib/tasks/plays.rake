namespace :plays do
	task :fetch => :environment do
		games = Game.where(:id => 51..151)
		games.each {
			|game|
			PlayJob.perform_later game
		}
	end
end
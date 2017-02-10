namespace :players do
	task :fetch => :environment do
		PlayerJob.addTeamToPlayer
	end
end
namespace :rosters do
	task :fetch => :environment do
		RosterJob.driver
	end
end
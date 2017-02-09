namespace :games do
	task :fetch => :environment do
		GameJob.perform_later
	end
end
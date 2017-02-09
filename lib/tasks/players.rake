namespace :players do
	task :fetch => :environment do
		PlayerJob.driver
	end
end
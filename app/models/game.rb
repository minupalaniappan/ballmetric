class Game < ActiveRecord::Base
	validates :away_team, presence: true
	validates :home_team, presence: true
	validates :season, presence: true
	validates :month, presence: true
	validates :day, presence: true
	validates :year, presence: true
	validates :game_id, presence: true
end

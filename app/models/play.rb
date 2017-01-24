class Play < ActiveRecord::Base
	belongs_to :player
	validates :tags, presence: true
	validates :game_id, presence: true
	validates :event_id, presence: true
	validates :away_team, presence: true
	validates :home_team, presence: true
	validates :description, presence: true
	validates :mp4, presence: true
	validates :month, presence: true
	validates :day, presence: true
	validates :year, presence: true
end

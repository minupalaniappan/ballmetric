class Play < ActiveRecord::Base
	belongs_to :game
	validate :playermap
	validates :event_id, presence: true
	validates :description, presence: true
	validates :mp4, presence: true
end
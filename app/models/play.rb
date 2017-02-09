class Play < ActiveRecord::Base
	belongs_to :game
	validates :playermap, presence: true
	validates :tags, presence: true
	validates :event_id, presence: true
	validates :description, presence: true
	validates :mp4, presence: true
end
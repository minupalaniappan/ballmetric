class Player < ActiveRecord::Base
		
	include Rails.application.routes.url_helpers

	extend FriendlyId
  	friendly_id :playerlowcase, use: :slugged
	
	def base_uri
		player_path(self)
	end

	def to_param
    	playerlowcase.parameterize
  	end

	has_many :plays, dependent: :destroy
	validates_presence_of :slug
	validates :firstname, presence: true
	validates :lastname, presence: true
	validates :position, presence: true
	validates :alphabet, presence: true
	validates :playertag, presence: true
	validates :playerlowcase, presence: true
	validates :team, presence: true
end

class Player < ActiveRecord::Base
		
	include Rails.application.routes.url_helpers

	extend FriendlyId
  	friendly_id :urlName, use: :slugged
	
	def base_uri
		player_path(self)
	end

	def to_param
    	urlName.parameterize
  	end
  	belongs_to :roster
	validates_presence_of :slug
	validates :firstName, presence: true
	validates :pos, presence: true
	validates :posExpanded, presence: true
	validates :heightFeet, presence: true
	validates :heightInches, presence: true
	validates :weightPounds, presence: true
	validates :personId, presence: true
	validates :isAllStar, :inclusion => { :in => [true, false] }
	validates :orderChar, presence: true
	validates :displayName, presence: true
	validates :urlName, presence: true

	

end

class Player < ActiveRecord::Base
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

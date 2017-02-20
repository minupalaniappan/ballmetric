class PlayersController < ApplicationController
	def index
	end
	def show
		ActiveRecord::Base.include_root_in_json = true
		player = Player.friendly.find(params[:id])
		@props = {
			player: player.attributes,
			prependedArguments: {
				start: params[:start],
				end: params[:end], 
				tag: params[:tag], 
				videoId: params[:videoId], 
				playerId: params[:playerid]
			}
		}.to_json
	end
end
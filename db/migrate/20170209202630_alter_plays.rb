class AlterPlays < ActiveRecord::Migration[5.0]
  def change
  	change_table :plays do |play|
  		play.json :playermap
  	end
  end
end

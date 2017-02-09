class AddPlaysToGame < ActiveRecord::Migration[5.0]
  def change
  	remove_column :plays, :game_id
  	add_reference :plays, :game, foreign_key: true
  	remove_reference :plays, :player, foreign_key: true
  	add_reference :players, :play, foreign_key: true
  end
end

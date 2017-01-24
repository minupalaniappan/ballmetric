class CreateGames < ActiveRecord::Migration[5.0]
  def change
    create_table :games do |t|
      	t.string :away_team
	    t.string :home_team
	    t.integer :season
	    t.integer :month
	    t.integer :day
	    t.integer :year
	    t.string :game_id
	    
      	t.timestamps
	end
  end
end

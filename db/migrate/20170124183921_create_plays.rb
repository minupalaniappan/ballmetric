class CreatePlays < ActiveRecord::Migration[5.0]
  def change
    create_table :plays do |t|
      t.string :game_id
      t.integer :event_id
      t.string :away_team
      t.string :home_team
      t.string :description
      t.string :mp4
      t.string :tags
      t.integer :month
      t.integer :day
      t.integer :year
      t.references :player, foreign_key: true
      
      t.timestamps
    end
  end
end

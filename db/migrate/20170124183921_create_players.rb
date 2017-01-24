class CreatePlayers < ActiveRecord::Migration[5.0]
  def change
    create_table :players do |t|
      	t.string :firstname
      	t.string :lastname
      	t.string :alphabet
      	t.string :playertag
      	t.string :team
      	t.string :position
      	t.string :playerlowcase
      	t.string :slug

      	t.timestamps
	end
  end
end

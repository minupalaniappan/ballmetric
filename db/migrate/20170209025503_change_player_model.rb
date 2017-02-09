class ChangePlayerModel < ActiveRecord::Migration[5.0]
  def change
  	
  	rename_column :players, :firstname, :firstName
	rename_column :players, :lastname, :lastName
	rename_column :players, :alphabet, :orderChar
	rename_column :players, :position, :pos
	rename_column :players, :playerlowcase, :urlName

	remove_column :players, :team

	add_column :players, :posExpanded, :string
	add_column :players, :heightFeet, :integer
	add_column :players, :heightInches, :integer
	add_column :players, :weightPounds, :integer
	add_column :players, :personId, :integer
	add_column :players, :isAllStar, :boolean
	add_column :players, :displayName, :string

  end
end

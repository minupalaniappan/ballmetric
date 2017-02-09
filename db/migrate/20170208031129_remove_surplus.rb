class RemoveSurplus < ActiveRecord::Migration[5.0]
  def change
  	remove_column :plays, :away_team
  	remove_column :plays, :home_team
  	remove_column :plays, :month
  	remove_column :plays, :day
  	remove_column :plays, :year
  end
end

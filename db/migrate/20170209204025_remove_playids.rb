class RemovePlayids < ActiveRecord::Migration[5.0]
  def change
  	remove_column :plays, :play_ids
  end
end

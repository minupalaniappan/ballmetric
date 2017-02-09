class ChangePlayId < ActiveRecord::Migration[5.0]
  def change
  	add_column :plays, :play_ids, :integer, array:true, default: []
  end
end

class RemoveTags < ActiveRecord::Migration[5.0]
  def change
  	 remove_column :plays, :tags
  end
end

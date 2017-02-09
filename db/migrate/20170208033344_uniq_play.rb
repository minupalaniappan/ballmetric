class UniqPlay < ActiveRecord::Migration[5.0]
  def change
  	add_index :plays, [:event_id, :mp4], :unique=> true
  end
end

class ChangePlayerRelation < ActiveRecord::Migration[5.0]
  def change
  	remove_reference :players, :play, foreign_key: true
  	add_reference :players, :roster, foreign_key: true
  end
end

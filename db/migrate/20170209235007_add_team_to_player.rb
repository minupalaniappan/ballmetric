class AddTeamToPlayer < ActiveRecord::Migration[5.0]
  def change
  	  	add_column :players, :teams, :string, array:true, default: []
  end
end

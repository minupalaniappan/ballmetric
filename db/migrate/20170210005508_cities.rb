class Cities < ActiveRecord::Migration[5.0]
  def change
  	  	add_column :players, :citys, :string, array:true, default: []

  end
end

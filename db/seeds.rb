# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
seeds = Dir[File.join(Rails.root, 'db', 'seeds', '*.rb')]
seeds.delete_at(2)
seeds.sort.each { |seed| load seed }
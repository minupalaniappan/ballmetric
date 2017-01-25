#require resque
require "resque_web"


Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root :to => 'players#index'
  mount ResqueWeb::Engine => "/resque_web"
  resources :players do
  	resources :plays
  end
end

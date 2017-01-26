require_relative 'boot'
require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Ballmetric
  class Application < Rails::Application
  	config.serve_static_assets = true

  	#fonts
  	google_webfonts_link_tag :open_sans        => [300, 400, 600, 700, 800]

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end

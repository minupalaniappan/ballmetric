# Run Rails & Webpack concurrently
# Example file from webpack-rails gem
rails: bundle exec rails server
webpack: ./node_modules/.bin/webpack-dev-server --config config/webpack.config.js
web: bundle exec rails server -p $PORT
worker: QUEUE=* bundle exec rake environment resque:work
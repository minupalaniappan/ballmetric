# Run Rails & Webpack concurrently
# Example file from webpack-rails gem
rails: bundle exec rails server
webpack: ./node_modules/.bin/webpack-dev-server --config config/webpack.config.js
resque: env TERM_CHILD=1 RESQUE_TERM_TIMEOUT=7 QUEUE=* bundle exec rake environment resque:work
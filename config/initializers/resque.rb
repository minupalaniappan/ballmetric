log_path = File.join Rails.root, 'log'
config = {
  folder:     log_path,                 # destination folder
  class_name: Logger,                   # logger class name
  class_args: [],  # logger additional parameters
  level:      Logger::INFO,              # optional
  formatter:  Logger::Formatter.new,    # optional
}

Resque.logger_config = config
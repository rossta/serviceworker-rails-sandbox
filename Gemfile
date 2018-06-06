source "https://rubygems.org"

ruby "2.3.1"

gem "rails", "~> 5.0.0"
gem "pg", "~> 0.15"
gem "puma"

gem "sass-rails", "~> 5.0"
gem "uglifier", ">= 1.3.0"
gem "jquery-rails"
gem "browserify-rails"
gem "react-rails"
gem "materialize-sass"
gem "sdoc", "~> 0.4.0", group: :doc

gem "rack-protection"
gem "title"
gem "flutie"
gem "high_voltage"
gem "i18n-tasks"

gem "twitter"
gem "ece"
gem "webpush", github: "rossta/webpush", branch: "master"
gem "sucker_punch"

gem "non-stupid-digest-assets"
gem "serviceworker-rails", github: "rossta/serviceworker-rails", branch: "master"

gem "nokogiri", "~> 1.8.2"

group :development, :test do
  gem "factory_girl_rails"
  gem "faker"
  gem "pry-rails"
  gem "pry-rescue"
  gem "pry-byebug"
  gem "awesome_print"
  gem "dotenv-rails"
end

group :development do
  gem "web-console", "~> 2.0"
  gem "better_errors"
  gem "guard-bundler"
  gem "guard-rails"
  gem "rails_layout"
  gem "rb-fchange", require: false
  gem "rb-fsevent", require: false
  gem "rb-inotify", require: false
  gem "annotate"
  gem "spring"
  gem "foreman"
end

group :test do
  gem "rspec-rails"
  # gem "capybara"
  gem "shoulda-matchers"
  gem "database_cleaner"
  gem "launchy"
  # gem "poltergeist"
  # gem "formulaic"
  gem "timecop"
  gem "webmock"
  gem "vcr"
  gem "seed-fu"
end

gem "rails_12factor", group: :production
gem "newrelic_rpm", ">= 3.7.3"

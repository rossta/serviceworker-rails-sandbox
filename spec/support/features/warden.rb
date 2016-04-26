module Features
  include Warden::Test::Helpers
  Warden.test_mode!
end

RSpec.configure do |config|
  config.before(:each, type: :feature) do
    Warden.test_reset!
  end
end


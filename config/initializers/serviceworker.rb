Rails.application.configure do
  config.serviceworker.routes.draw do
    match "/serviceworker.js" => "home/serviceworker.js"

    match "/pages/*pages/serviceworker.js" => "%{pages}/serviceworker.js"
  end
end

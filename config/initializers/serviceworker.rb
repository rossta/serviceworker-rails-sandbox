Rails.application.configure do
  config.serviceworker.routes.draw do
    match "/serviceworker.js" => "home/serviceworker.js"

    match "/*pages/serviceworker.js" => "%{pages}/serviceworker.js"

    match "/*pages/manifest.json" => "%{pages}/manifest.json"
  end
end

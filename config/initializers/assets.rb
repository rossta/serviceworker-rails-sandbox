# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
# Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.

# Rails.application.config.assets.precompile += %w( search.js )
#
Rails.application.configure do
  # Version of your assets, change this if you want to expire all your assets.
  config.assets.version = '1.1'

  # Add additional assets to the asset load path
  # Rails.application.config.assets.paths << Emoji.images_path

  # Precompile additional assets.
  # application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
  # Rails.application.config.assets.precompile += %w( search.js )
  config.assets.precompile += %w(
    home/serviceworker.js
    cache-then-network/serviceworker.js
    cache-then-network.js
    offline-fallback/serviceworker.js
    offline-fallback.js
    push-simple/serviceworker.js
    push-simple.js
    push-simple/manifest.json
    push-react.js
    push-react/serviceworker.js
    push-react/manifest.json
    background-sync-get.js
    background-sync-get/serviceworker.js
  )

  # Use ES2015 and react in asset pipeline
  config.browserify_rails.commandline_options = [
    "-t [ babelify --presets [ es2015 react ] ]",
    "--extension=\".jsx\""
  ]
end


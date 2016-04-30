# Service Workers on Rails

This sandbox demonstrates various use cases for "Service Workers on Rails". Integration of Service Workers with the Rails asset pipeline is provided by the [serviceworker-rails](https://github.com/rossta/serviceworker-rails).

## Background

The [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) is coming. Service Workers are scripts that act as a proxy between the browser and the server. Among other things, Service Workers can be used to:

- enable the creation of effective offline experiences
- increase perceived performance while online
- access push notifications and background sync APIs.

Service Workers are scripts that live outside the context of a rendered page.
This means the are some considerations for hosting Service Workers:

- service workers must be served over HTTPS
- service workers must be served within the "scope" of the page(s) they control ([pending override capability](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/#service-worker-allowed))
- service workers should not be cached: browsers install service workers in the background so requesting and evaluating
these scripts will not tie up page rendering

### Rails integration

So you want to use Service Workers in your Rails app? Consider that the Rails asset pipeline bundles JavaScript assets so that they're typically finger-printed, heavily cached, and served out of the `/assets` directory. While we'd like to take advantage of the asset pipeline for transpiling our Service Worker scripts just like any other JavaScript assets, we need flexibility for how these assets are served to the client.

This is where the [serviceworker-rails](https://github.com/rossta/serviceworker-rails) gem comes in. Using [serviceworker-rails] in your Rails app allows you to map Service Worker endpoints to bundled Rails assets and adds the appropriate (configurable) response headers. You can still take advantage of the Rails pipeline in development and production!

The sandbox [`config/application.rb`](https://github.com/rossta/serviceworker-rails-sandbox/blob/master/config/application.rb) provides several examples for customizing how service worker endpoints should map to assets in the Rails asset pipeline.

## Resources

Examples in this sandbox are inspired by a variety of resources:

* [Mozilla's Service Worker Cookbook](https://github.com/mozilla/serviceworker-cookbook/)
* [Jake Archibald's Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/)
* [Pony Foo Service Worker Articles](https://ponyfoo.com/articles/tagged/serviceworker)

## Development

Coming soon.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/[USERNAME]/serviceworker-rails. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

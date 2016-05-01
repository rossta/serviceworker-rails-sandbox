require "addressable/uri"

module TwitterHelper
  def tweet_link_to(text, params = {})
    uri = Addressable::URI.parse("https://twitter.com/intent/tweet")
    uri.query_values = params.reverse_merge hashtags: "serviceworker-rails,serviceworker"
    link_to text, uri.to_s, target: "_blank"
  end
end

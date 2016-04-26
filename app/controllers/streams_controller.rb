class StreamsController < ApplicationController
  def index
  end

  private

  def client
    @client ||= TwitterClient.new
  end

  def query
    params.fetch(:q, "@EmrgencyKittens")
  end
  helper_method :query

  def tweets
    @tweets ||= client.search("#{query} filter:images -RT").take(25).map { |t| Tweet.new(t) }
  end
  helper_method :tweets

end

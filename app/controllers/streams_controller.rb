class StreamsController < ApplicationController
  QUERIES = {
    cats: "from:@EmrgencyKittens filter:images -RT"
  }.with_indifferent_access

  def index
    @query = search_query
  end

  def show
    @query = QUERIES.fetch(params[:id]) { raise ActiveRecord::RecordNotFound }
  end

  private

  def client
    @client ||= TwitterClient.new
  end

  def search_query
    params.fetch(:q, QUERIES[:cats])
  end

  def tweets(stream)
    client.search(stream).take(25).map { |t| Tweet.new(t) }
  end
  helper_method :tweets

end

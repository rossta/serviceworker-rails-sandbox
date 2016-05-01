class StreamsController < ApplicationController
  QUERIES = {
    cats: "#cats filter:images -RT"
  }.with_indifferent_access

  def index
    @query = search_query

    respond_to do |format|
      format.html
      format.json { render json: tweets(@query) }
    end
  end

  def show
    @query = QUERIES.fetch(params[:id]) { raise ActiveRecord::RecordNotFound }

    respond_to do |format|
      format.html
      format.json { render json: tweets(@query) }
    end
  end

  private

  def client
    @client ||= TwitterClient.new
  end

  def search_query
    params.fetch(:q, QUERIES[:cats])
  end

  def tweets(query)
    client.search(query).take(25).map { |t| Tweet.new(t) }
  end
  helper_method :tweets

end

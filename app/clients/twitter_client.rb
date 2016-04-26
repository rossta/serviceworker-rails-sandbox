class TwitterClient
  def initialize(account)
    @account = account
  end

  def client
    @client ||= Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV.fetch('TWITTER_CONSUMER_KEY')
      config.consumer_secret     = ENV.fetch('TWITTER_CONSUMER_SECRET')
      config.access_token        = @account.token
      config.access_token_secret = @account.secret
    end
  end

  def timeline(*args)
    return enum_for(:timeline) unless block_given?

    client.home_timeline.each do |tweet|
      yield TwitterClient::Tweet.new(tweet)
    end
  end

  def method_missing(method, *args)
    if client.respond_to?(method)
      client.send(method, *args)
    else
      super
    end
  end

  class Tweet < SimpleDelegator
    def body; text; end
  end
end

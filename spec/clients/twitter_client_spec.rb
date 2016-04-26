require "rails_helper"

describe TwitterClient do
  let(:account) { double(token: token, secret: secret) }
  let(:client) { TwitterClient.new(account) }

  def token
    ENV.fetch('TWITTER_ACCESS_TOKEN')
  end

  def secret
    ENV.fetch('TWITTER_ACCESS_SECRET')
  end

  describe "#client" do
    it "wraps the twitter gem rest client" do
      twitter = client.client
      expect(twitter).to be_instance_of ::Twitter::REST::Client
    end
  end

  describe "#timeline" do
    it "returns twitter home_timeline" do
      stub_request(:get, "https://api.twitter.com/1.1/statuses/home_timeline.json").
        with(headers: { "Accept" => "application/json" }).
        and_return(body: [
          {
            id: 1234,
            text: "Waking up"
          },
          {
            id: 1235,
            text: "Drinking coffee"
          },
          {
            id: 1236,
            text: "Walking the dog"
          }].to_json,
          status: 200)

        expect(client.timeline.map(&:body)).to eq ['Waking up', 'Drinking coffee', 'Walking the dog']
    end
  end
end


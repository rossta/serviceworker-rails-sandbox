require "spec_helper"

describe WebpushClient do
  let(:client) { WebpushClient.new }

  describe "#send_notification" do
    it "sends to google endpoint" do
      p256dh = SecureRandom.random_bytes(65)
      auth = SecureRandom.random_bytes(16)
      endpoint = "https://android.googleapis.com/gcm/send/subscriptionId"

      expect(Webpush).to receive(:payload_send).with(
        message: "Hello World",
        endpoint: "https://android.googleapis.com/gcm/send/subscriptionId",
        p256dh: p256dh,
        auth: auth,
        api_key: ENV.fetch('GOOGLE_CLOUD_MESSAGE_API_KEY')
      )

      client.send_notification("Hello World", endpoint: endpoint, p256dh: p256dh, auth: auth)
    end
  end
end

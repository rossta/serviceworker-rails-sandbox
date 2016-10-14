require "spec_helper"

describe WebpushClient do
  let(:client) { WebpushClient.new }

  describe "#send_notification" do
    it "sends to google endpoint" do
      p256dh = SecureRandom.random_bytes(65)
      auth = SecureRandom.random_bytes(16)
      endpoint = "https://fcm.googleapis.com/gcm/send/subscriptionId"

      allow(WebpushClient).to receive(:public_key).and_return("public_key")
      allow(WebpushClient).to receive(:private_key).and_return("private_key")

      expect(Webpush).to receive(:payload_send).with(
        message: "Hello World",
        endpoint: "https://fcm.googleapis.com/gcm/send/subscriptionId",
        p256dh: p256dh,
        auth: auth,
        vapid: {
          subject: "mailto:ross@rossta.net",
          public_key: "public_key",
          private_key: "private_key"
        }

      )

      client.send_notification("Hello World", endpoint: endpoint, p256dh: p256dh, auth: auth)
    end
  end
end

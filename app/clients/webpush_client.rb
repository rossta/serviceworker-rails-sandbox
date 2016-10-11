class WebpushClient
  PUBLIC_KEY = "BB9KQDaypj3mJCyrFbF5EDm-UrfnIGeomy0kYL56Mddi3LG6AFEMB_DnWUXSAmNFNOaIgTlXrT3dk2krmp9SPyg="
  PRIVATE_KEY ="JYQ5wbkNfJ2b1Kv_t58cUJJENBIIboVv5Ijzk6a5yH8="

  SUBSCRIPTION = {
    :endpoint=>"https://fcm.googleapis.com/fcm/send/fdJm4S5rzj8:APA91bHdht6r-oXwx5EAlOIm3EFRMvSIEsQf8r79p9W6vVZ_5K9oMhEnrhahtazyTX2j7z1z30KOKCI8ATC3vuSKy_zrOmHU9zO8YwZFu4sNW6IhpHf_k6OTCrvzlwc8Q8_8hUpUU5gm",
    :p256dh=>"BLhM3NTCXXt76nflRZCrx0DdiPTmtxLl0l-uXwSiFqdZTf5mAq8rt_VFRqutA8FwZsz5vBA-JpUZjgioehTlSdI=",
    :auth=>"6qLda9rw3x8cG5uowvytDw=="
  }

  FIREFOX = {
    :endpoint => "https://updates.push.services.mozilla.com/wpush/v2/gAAAAABX9xnU2nIjElmHkBJmHpt9curGStrH1lt9pwPufsbJDsfZprpJ-rrWABFrzvNoN5E5_TsYwt27keblGUQqDccoiat-OOPryNO1kO1BXqZi0r9Ogf2cCg9q7XiyMCpHq949_OoOGW8vONE6eYbVJ-EyhKEuwCRTv5vAZgEPCNlsFQSg71c",
    :auth => "GzdPDQvcdzj_S_GdVRsxuQ",
    :p256dh => "BPcUY3mhrBkMsSjsZsRpfWVkfWTMydGeCfldRg_L5xCtNtdpVfmCWZQyTJ9ND3NCo_NK2E2KRGKMGPXOjFZGbDY"
  }

  # Send webpush message using subscription parameters
  #
  # @param message [String] text to encrypt
  # @param subscription_params [Hash<Symbol, String>]
  # @option subscription_params [String] :endpoint url to send encrypted message
  # @option subscription_params [Hash<Symbol, String>] :keys auth keys to send with message for decryption
  # @return true/false
  def send_notification(message, endpoint: "", p256dh: "", auth: "")
    raise ArgumentError, ":endpoint param is required" if endpoint.blank?
    raise ArgumentError, "subscription :keys are missing" if p256dh.blank? || auth.blank?

    Rails.logger.info("Sending WebPush notification...............")
    Rails.logger.info("message: #{message}")
    Rails.logger.info("endpoint: #{endpoint}")
    Rails.logger.info("p256dh: #{p256dh}")
    Rails.logger.info("auth: #{auth}")

    Webpush.payload_send \
      message: message,
      endpoint: endpoint,
      p256dh: p256dh,
      auth: auth,
      vapid: {
        subject: "mailto:ross@rossta.net",
        public_key: PUBLIC_KEY,
        private_key: PRIVATE_KEY
      }

    # Webpush.new(subscription)
    # webpush = WebPush.new(endpoint: endpoint, keys: { p256dh: p256dh, auth: auth })
    # webpush.set_vapid_details(
    #   "mailto:sender@example.com",
    #   PUBLIC_KEY,
    #   PRIVATE_KEY
    # )
    # webpush.send_notification(message)
  end

  def test_send
    send_notification("You're a good person, Ross", WebpushClient::SUBSCRIPTION)
  end
end

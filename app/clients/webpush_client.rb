class WebpushClient
  def initialize(google_key: nil)
    @google_key = google_key || ENV.fetch('GOOGLE_CLOUD_MESSAGE_API_KEY', nil)
  end

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

    Webpush.payload_send \
      message: message,
      endpoint: endpoint,
      p256dh: p256dh,
      auth: auth,
      api_key: api_key_for_host(endpoint)
  end

  def api_key_for_host(endpoint)
    case endpoint
    when %r{https?://[^/]*google[^/]*/}
      @google_key
    else
      ''
    end
  end
end

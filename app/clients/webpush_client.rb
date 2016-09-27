class WebpushClient
  PUBLIC_KEY = "BNcyGTkBni3_xKHBuTA0ldfgGdE_QaLLwOO9Vo20NngWnWYixbOP8irmfsQrmOmEQpOZt7Q0AtwnlOYE4BHeIgk"
  PRIVATE_KEY = "y74a3L_5dWKvyOuM3k9Ai__7Ir0s49UFPrvwVgukyBA="

  SUBSCRIPTION = {
    endpoint:"https://fcm.googleapis.com/fcm/send/fDf_PbtYk70:APA91bHCU87CoC2eX1B-nneaEQ7DCZqGoTkIp6EDm5f979uEvPVa99TyTSstbsKYmjvp_hajtZvkxKUnavPzTgO6kBb242OUJj1hPWYYPVofxN6Z2tDi7A2eWEk4OdME2PHVK0HAji8J",
    p256dh:"BKXmTRnY3iFBArC6WHVFhRqiyQWNI_9taE9AWU7f_JGWrE4lO4cw4Blx5ujt9WN6kUTZVEuntGWfE5QUThno-9k=",
    auth:"RejvG7F4S4NJ3xOycwT3IA=="
  }

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
        audience: "https://serviceworker.dev",
        subject: "mailto:ross@rossta.net",
        public_key: PUBLIC_KEY,
        private_key: PRIVATE_KEY
      }
  end

  def vapid_headers
    Webpush::Encryption.vapid_headers(
      audience: "https://serviceworker.dev",
      subject: "mailto:ross@rossta.net",
      public_key: PUBLIC_KEY,
      private_key: PRIVATE_KEY,
      expiration: 1475032046
    )
  end

  def test_send
    send_notification("You're a good person, Ross", WebpushClient::SUBSCRIPTION)
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

# encoding: binary
#
class GCMClient
  ONE_BUFFER = "1"
  AUTH_INFO = "Content-Encoding: auth" + '\0'
  MAX_PAYLOAD_LENGTH = 4078;

  def initialize(gcm_api_key=nil)
    @gcm_api_key = gcm_api_key || ENV.fetch('GOOGLE_CLOUD_MESSAGE_API_KEY', nil)
  end

  def client
    @client ||= GCM.new(@gcm_api_key)
  end

  def send_notification(message, params)
    api_key = ''
    api_key = @gcm_api_key if params[:endpoint] =~ /google.com/
    Webpush.payload_send \
      message: message,
      endpoint: params[:endpoint],
      p256dh: params.dig(:keys, :p256dh),
      auth: params.dig(:keys, :auth),
      api_key: api_key
  end
end

class PushNotificationsController < ApplicationController
  def create
    Rails.logger.info "Sending push notification from #{params}"
    subscription_params = fetch_subscription_params

    WebpushJob.perform_later fetch_message,
      endpoint: subscription_params[:endpoint],
      p256dh: subscription_params.dig(:keys, :p256dh),
      auth: subscription_params.dig(:keys, :auth)

    head :ok
  end

  private

  def fetch_message
    params.fetch(:message, "Hello, World, the time is #{Time.zone.now}")
  end

  def fetch_subscription_params
    params.fetch(:subscription, decode_subscription_session)
  end

  def decode_subscription_session
    encoded_subscription = session.fetch(:subscription) { raise PushNotificationError,
                                                          "Cannot create notification: no :subscription in params or session" }

    JSON.parse(Base64.urlsafe_decode64(encoded_subscription)).with_indifferent_access
  end
end

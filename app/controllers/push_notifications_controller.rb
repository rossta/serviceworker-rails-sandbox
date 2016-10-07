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
    params.fetch(:message, "You're a good person, Ross")
  end

  def fetch_subscription_params
    params.fetch(:subscription, extract_session_subscription)
  end

  def extract_session_subscription
    subscription = session.fetch(:subscription) { raise PushNotificationError,
                                                          "Cannot create notification: no :subscription in params or session" }

    JSON.parse(subscription).with_indifferent_access
  end
end

class PushNotificationsController < ApplicationController
  def create
    Rails.logger.info "Sending push notification from #{params}"
    subscription = JSON.parse(Base64.urlsafe_decode64(session.fetch(:subscription))).with_indifferent_access

    client = GCMClient.new
    client.send_notification("Hello, World, the time is #{Time.zone.now}", subscription)

    head :ok
  end
end

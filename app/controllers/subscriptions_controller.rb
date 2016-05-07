class SubscriptionsController < ApplicationController
  def create
    registration_id = find_registration_id
    Rails.logger.info("registration_id #{registration_id}")
    session[:gcm_registration_id] = registration_id if registration_id
    head :ok
  end

  def find_registration_id
    endpoint = params.dig(:subscription, :endpoint)

    registration_id = endpoint.split("/").last

    registration_id.presence && registration_id
  end

  def client_public_key
    key = params.dig(:subscription, :keys, :p256dh) or return nil

    Base64.decode64(key).tap { |k| Rails.logger.info("client_public_key: #{k}") }
  end

  def client_auth_secret
    key = params.dig(:subscription, :keys, :auth) or return nil

    Base64.decode64(key).tap { |k| Rails.logger.info("client_auth_secret: #{k}") }
  end
end

class WebpushJob < ActiveJob::Base
  queue_as :default

  def perform(message, params)
    client = WebpushClient.new

    log("sending #{message} to #{params[:endpoint]}")
    sent = client.send_notification(message, params)
    log(sent ? "success" : "failed")
    log(sent.inspect)
  end

  def log(message)
    Rails.logger.info("[WebpushClient] #{message}")
  end
end

class SubscriptionsController < ApplicationController
  def create
    session[:subscription] = Base64.urlsafe_encode64(JSON.dump(params.fetch(:subscription)))
    head :ok
  end
end

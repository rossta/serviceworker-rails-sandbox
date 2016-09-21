class SubscriptionsController < ApplicationController
  def create
    session[:subscription] = params.fetch(:subscription).to_json

    head :ok
  end

  def destroy
    session.delete(:subscription)

    head :ok
  end
end

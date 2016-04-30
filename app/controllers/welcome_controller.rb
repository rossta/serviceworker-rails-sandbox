class WelcomeController < ApplicationController
  def index
  end

  def offline
    render layout: 'offline'
  end
end

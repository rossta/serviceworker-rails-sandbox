class PagesController < ApplicationController
  include HighVoltage::StaticPage

  before_filter :ensure_trailing_slash

  def ensure_trailing_slash
    redirect_to url_for(params.merge(trailing_slash: true)), :status => 301 unless trailing_slash?
  end

  def trailing_slash?
    request.env['REQUEST_URI'].match(/[^\?]+/).to_s.last == '/'
  end
end

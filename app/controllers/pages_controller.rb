class PagesController < ApplicationController
  include HighVoltage::StaticPage

  before_filter :ensure_trailing_slash

  def ensure_trailing_slash
    redirect_to url_for(params.merge(trailing_slash: true)) unless skip_redirect?
  end

  def skip_redirect?
    trailing_slash? || asset?
  end

  def asset?
    request.env['REQUEST_URI'].split(".").last =~ %r{^(js|css|json)$}
  end

  def trailing_slash?
    request.env['REQUEST_URI'].match(/[^\?]+/).to_s.last == '/'
  end
end

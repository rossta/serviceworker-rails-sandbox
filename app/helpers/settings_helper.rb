module SettingsHelper
  def settings
    Rails.configuration.settings
  end

  def google_analytics_tracking_id
    settings.google_analytics_tracking_id
  end
end

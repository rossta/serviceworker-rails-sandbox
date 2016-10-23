class SyncController < ApplicationController
  def index
    render text: %w[terrier retriever poodle setter hound beagle].sample
  end

  # def index
  #   sync_time = session[:sync_time] or set_sync_time
  #
  #   if sync_time >= Time.zone.now.to_i
  #     session.delete(:sync_time)
  #     render text: %w[terrier retriever poodle setter hound beagle].sample
  #   else
  #     render status: :service_unavailable
  #   end
  # end

  private

  def set_sync_time
    session[:sync_time] = (Time.zone.now + 15.seconds).to_i
  end
end

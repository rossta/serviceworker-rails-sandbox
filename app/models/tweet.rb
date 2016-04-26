class Tweet < SimpleDelegator
  extend ActiveModel::Naming
  include ActiveModel::Conversion

  def persisted?
    true
  end
end

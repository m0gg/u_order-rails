require 'active_record'

module UOrder
  module ActiveRecord
    module RelationMethods

    end

    ::ActiveRecord::Base.extend Order
  end
end
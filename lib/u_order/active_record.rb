require 'active_record'

module UOrder
  module ActiveRecord
    module Order

      def uorder(options = {})
        col = options.first
        rel.order(col) if col
      end

    end
  end
end
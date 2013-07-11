require 'active_record'

module UOrder

  module RelationMethods

    private
    def column_is_available? col
      column_names.include?(col.to_s)
    end

    def _uorder_single(col)
      if column_is_available?(col)
        orders = [col.to_s]
      else
        raise "Unknown column #{col}!"
      end
    end

    public
    def uorder(options)
      if options.is_a? Hash
        orders = options.map do |col,val|
          if column_is_available?(col)
            column = col.to_s
          else
            raise "Unknown column #{col}!"
          end
          if ['asc', 'desc'].include?(val.to_s.downcase)
            direction = val
          end
          (direction && column) ? [column, direction].join(' ') : nil
        end

      elsif options.is_a?(Symbol) or options.is_a?(String)
        orders = _uorder_single(options)
      end

      unless orders.nil? || orders.empty?
        orders.compact!
        order(orders.join(','))
      else
        clone
      end
    end

  end

  class Engine < ::Rails::Engine
  end

  class Railtie < Rails::Railtie
    railtie_name :u_order
    initializer "u_order.activerecord" do |app|
      ActiveSupport.on_load :active_record do
        ::ActiveRecord::Base.extend RelationMethods
        ::ActiveRecord::Relation.send(:include, RelationMethods)
      end

    end
  end
end
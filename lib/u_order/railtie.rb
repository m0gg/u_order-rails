module UOrder
  class Railtie < Rails::Railtie
    ActiveSupport.on_load :active_record do
      require 'u_order/active_record'
    end
  end
end
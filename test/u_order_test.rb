require 'test_helper'

class UOrderTest < ActiveSupport::TestCase
  test "truth" do
    assert_kind_of Module, UOrder
    assert_kind_of Method, :uorder
  end
end

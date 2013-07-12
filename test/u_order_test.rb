require 'test_helper'

class UOrderTest < ActiveSupport::TestCase
  test 'modules' do
    assert_kind_of Module, UOrder
    assert_kind_of Module, UOrder::RelationMethods
  end

  test 'active_record' do
    assert_includes ActiveRecord::Relation.included_modules, UOrder::RelationMethods
    assert_respond_to Post, :uorder
    assert_raise ArgumentError do Post.uorder end
    assert_not_nil Post.uorder(:id)
    req = Post.uorder({ :id => :asc })
    assert_not_nil req
    assert_equal req, Post.order('id asc').all
  end
end

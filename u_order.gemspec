$:.push File.expand_path('../lib', __FILE__)

# Maintain your gem's version:
require 'u_order/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = 'u_order'
  s.version     = UOrder::VERSION
  s.authors     = ['Marcel Sackermann']
  s.email       = ['marcel@m0gg.org', 'marcel@iras-revier.de']
  s.homepage    = 'http://m0gg.org'
  s.summary     = ''
  s.description = ''

  s.files = Dir['{app,config,db,lib}/**/*'] + ['MIT-LICENSE', 'Rakefile', 'README.rdoc']
  s.test_files = Dir['test/**/*']

  s.add_dependency 'rails', '~> 3.1'
  s.add_dependency 'jquery-rails'
  s.add_dependency 'jquery-ui-rails'

  s.add_development_dependency 'sqlite3'
end

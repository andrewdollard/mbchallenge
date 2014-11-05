require 'sinatra'
require 'sinatra/assetpack'
require 'haml'
require 'csv'

assets do
  serve '/css', from: 'stylesheets'
  serve '/js', from: 'scripts'
  css :main, [ '/css/*.css' ]
  js :main, [ '/js/*.js' ]
end

get '/' do
  @data = CSV.read('sample_data.csv')
  @data.shift
  haml :index
end


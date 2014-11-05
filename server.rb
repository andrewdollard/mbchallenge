require 'sinatra'
require 'haml'
require 'csv'

get '/' do
  @data = CSV.read('sample_data.csv')
  @data.shift
  haml :index
end

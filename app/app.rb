require 'sinatra'
require 'sinatra/assetpack'
require 'haml'
require 'csv'
require 'json'

assets do
  serve '/css', from: 'stylesheets'
  serve '/js', from: 'scripts'
  css :main, [ '/css/*.css' ]
  js :main, [ '/js/*.js' ]
end

get '/' do
  @data = CSV.foreach('sample_data.csv').reject{|r| r[0] == 'Date'}.map do |row|
      {
        timestamp: Time.strptime("#{row[0]} #{row[1]}", "%m/%d/%Y %I:%M %p"),
        gender: row[2],
        device: row[3],
        activity: row[4]
      }
  end
  @json_data = JSON.generate(@data)
  haml :index
end


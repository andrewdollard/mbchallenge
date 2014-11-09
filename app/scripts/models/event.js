var App = App || {};

App.dateFormat = '%Y-%m-%d %X %Z';
App.Event = Backbone.Model.extend({

  parse: function(response) {
    response.timestamp = d3.time.format(App.dateFormat).parse(response.timestamp);
    return response;
  }
  
});

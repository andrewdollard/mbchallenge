var App = App || {};

App.Event = Backbone.Model.extend({

  parse: function(response) {
    response.timestamp = new Date(response.timestamp);
    return response;
  }

});

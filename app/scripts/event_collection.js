var App = App || {};

App.EventCollection = Backbone.Collection.extend({
  model: App.Event,

  comparator: 'timestamp',

  filterByDateRange: function(start, stop) {
    var filteredEvents = this.filter(function(event) {
      return (event.get('timestamp') <= stop) && (event.get('timestamp') >= start);
    });
    return new App.EventCollection(filteredEvents);
  }


});

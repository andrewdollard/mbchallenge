var App = App || {};

App.EventCollection = Backbone.Collection.extend({
  model: App.Event,

  comparator: 'timestamp',

  filterByDateRange: function(start, stop) {
    var filteredEvents = this.filter(function(event) {
      return (event.get('timestamp') <= stop) && (event.get('timestamp') >= start);
    });
    return new App.EventCollection(filteredEvents);
  },

  percentActive: function(){
    var activeCount = this.filter(function(e){
      return (e.get('activity') == '1');
    }).length;
    return (activeCount / this.models.length) * 100;
  },

  byDevice: function(){
    var data = this.groupBy(function(event){ return event.get('device')});
    return _(data).map(function(deviceGroup, deviceName){ return [deviceName, new App.EventCollection(deviceGroup)] });
  }

});

var App = App || {};

App.EventCollection = Backbone.Collection.extend({
  model: App.Event,

  comparator: 'timestamp',

  percentActive: function(){
    var activeCount = this.filter(function(e){
      return (e.get('activity') == '1');
    }).length;
    return (activeCount / this.models.length) * 100;
  }
  
});

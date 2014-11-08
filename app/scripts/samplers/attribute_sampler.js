var App = App || {};

App.AttributeSampler = function(eventCollection, attribute) {
  this._events = eventCollection;
  this._attribute = attribute;
  this.groupedData = eventCollection.groupBy(function(event){ return event.get(attribute)});
};

App.AttributeSampler.prototype.samples = function(){
  return _(this.groupedData).map(function(group){ return new App.EventCollection(group) });
};


App.AttributeSampler.prototype.values = function(){
  return _(this.groupedData).map(function(group, name){ return name });
};

App.AttributeSampler.prototype.totalLength = function(){
  return this._events.length;
};
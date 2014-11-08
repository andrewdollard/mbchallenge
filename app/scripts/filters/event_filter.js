var App = App || {};

App.EventFilter = function(events) {
  this._events = events;
  this._predicates = [];
  return this;
};

App.EventFilter.prototype.addPredicate = function(predicate) {
  return this;
};


App.EventFilter.prototype.filter = function() {
  return this._events;
};


var App = App || {};

App.EventFilter = function(events) {
  this._events = events;
  this._predicates = [];
  return this;
};

App.EventFilter.prototype.addPredicate = function(predicate) {
  this._predicates = this._predicates.concat(predicate);
  return this;
};

App.EventFilter.prototype.filter = function() {
  var self = this;
  var filtered = this._events.filter(function (event) {
    return _.every(self._predicates, function (pred) {
      return pred(event);
    });
  });
  return new App.EventCollection(filtered);
};


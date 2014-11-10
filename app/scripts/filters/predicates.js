var App = App || {};

App.EqualityPredicateFactory = function(attr, val) {
  return function(event) {
    return event.get(attr) == val;
  }
};

App.RangePredicateFactory = function(attr, start, end) {
  return function(event) {
    return (event.get(attr) <= end) && (event.get(attr) >= start);
  }
};
var App = App || {};

App.RangePredicateFactory = function(attr, start, end) {
  var start = start;
  var end = end;
  return function(event) {
    return (event.get(attr) <= end) && (event.get(attr) >= start);
  }
};
var App = App || {};

App.DateRangePredicateFactory = function(start, end) {
  var start = start;
  var end = end;
  return function(event) {
    return (event.get('timestamp') <= end) && (event.get('timestamp') >= start);
  }
};
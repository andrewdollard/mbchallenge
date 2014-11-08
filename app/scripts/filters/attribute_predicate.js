var App = App || {};

App.AttributePredicateFactory = function(attribute, value) {
  var attr = attribute;
  var val = value;
  return function(event) {
    return event.get(attr) == val;
  }
};
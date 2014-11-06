var App = App || {};

App.DataSampler = function(eventCollection, options) {
  this._events = eventCollection;
  this._options = options;
};

App.DataSampler.prototype.samples = function(){
  var earliestTimeStamp = this._events.first().get('timestamp'),
      result = [];
  for (var i = 0; i < this._events.length; i++) {
    var p = Math.floor((this._events.at(i).get('timestamp') - earliestTimeStamp) / this._options.periodLength);
    result[p] = result[p] || (new App.EventCollection);
    result[p].add(this._events.at(i));
  }
  return result;
};


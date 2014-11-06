var App = App || {};

App.EventSampler = function(eventCollection, options) {
  var earliestTimeStamp = eventCollection.first().get('timestamp'),
      latestTimeStamp = eventCollection.last().get('timestamp');


  this._timeFloor = Math.floor(earliestTimeStamp / options.periodLength) * options.periodLength;
  this._timeCeil = Math.ceil(latestTimeStamp / options.periodLength) * options.periodLength;
  this._events = eventCollection;
  this._options = options;
};

App.EventSampler.prototype.samples = function(){
  var i, result = [];

  for (i = 0; i < this._events.length; i++) {
    var p = Math.floor((this._events.at(i).get('timestamp').getTime() - this._timeFloor) / this._options.periodLength);
    result[p] = result[p] || (new App.EventCollection);
    result[p].add(this._events.at(i));
  }

  return result;
};

App.EventSampler.prototype.timestamps = function() {
  var result = [],
      currentStamp = this._timeFloor;

  while (currentStamp < this._timeCeil) {
    result = result.concat(new Date(currentStamp));
    currentStamp += this._options.periodLength;
  }

  return result;
};

App.EventSampler.prototype.startTime = function() {
  return new Date(this._timeFloor);
};

App.EventSampler.prototype.endTime = function() {
  return new Date(this._timeCeil);
};

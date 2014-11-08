var App = App || {};

App.TimeSampler = function(eventCollection, period) {
  var earliestTimeStamp = eventCollection.first().get('timestamp'),
      latestTimeStamp = eventCollection.last().get('timestamp');

  this._timeFloor = Math.floor(earliestTimeStamp / period) * period;
  this._timeCeil = Math.ceil(latestTimeStamp / period) * period;
  this._events = eventCollection;
  this._period = period;
};

App.TimeSampler.prototype.samples = function(){
  var i, result = [];

  for (i = 0; i < this._events.length; i++) {
    var p = Math.floor((this._events.at(i).get('timestamp').getTime() - this._timeFloor) / this._period);
    result[p] = result[p] || (new App.EventCollection);
    result[p].add(this._events.at(i));
  }

  return result;
};

App.TimeSampler.prototype.timestamps = function() {
  var result = [],
      currentStamp = this._timeFloor;

  while (currentStamp < this._timeCeil) {
    result = result.concat(new Date(currentStamp));
    currentStamp += this._period;
  }

  return result;
};

App.TimeSampler.prototype.startTime = function() {
  return new Date(this._timeFloor);
};

App.TimeSampler.prototype.endTime = function() {
  return new Date(this._timeCeil);
};

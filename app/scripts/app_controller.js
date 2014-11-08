var App = App || {};

App.controller = _.clone(Backbone.Events);

App.controller.start = function(){
  var hour = 1000 * 60 * 60;
  App.now = new Date('2014-07-31');
  this._days = [1,3,7,14];
  this._periodsForDays = [hour, hour * 3, hour * 6, hour * 6];
  this._setDayLimit(this._days[0]);

  this._activityView = new App.ActivityView({el: $('#activity-view')});
  this._segmentView = new App.SegmentView({el: $('#segment-view')});
  this._deviceView = new App.DeviceView({el: $('#device-view')});
  var datePickerView = new App.DatePickerView({el: $('#date-picker-view'), days: this._days});

  this._updateViews();
  datePickerView.render();
};

App.controller._updateViews = function() {
  var subset = App.events.filterByDateRange(this._startDate, App.now),
      activitySampler = new App.TimeSampler(subset, this._periodsForDays[this._currentDayIndex]),
      deviceSampler = new App.AttributeSampler(subset, 'device'),
      segmentSampler = new App.AttributeSampler(subset, 'gender');

  this._segmentView.setSampler(segmentSampler);
  this._segmentView.render();

  this._deviceView.setSampler(deviceSampler);
  this._deviceView.render();

  this._activityView.setSampler(activitySampler);
  this._activityView.render();
};

App.controller.on('dateChange', function(days){
  this._setDayLimit(days);
  this._updateViews();
});

App.controller._setDayLimit = function(days){
  this._currentDayIndex = _.indexOf(this._days, days);
  var startDate = new Date(App.now),
      dayOfMonth =  startDate.getDate();
  startDate.setDate(dayOfMonth - this._days[this._currentDayIndex]);
  this._startDate = startDate;
};
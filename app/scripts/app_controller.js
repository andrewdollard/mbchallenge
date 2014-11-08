var App = App || {};

App.controller = _.clone(Backbone.Events);

App.controller.start = function(){
  this._days = [1,3,7,14];
  this._periodsForDays = [App.constants.HOUR, App.constants.HOUR * 3, App.constants.HOUR * 6, App.constants.HOUR * 6];
  this._currentDayIndex = 0;
  this._setStartDate();

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

App.controller.on('dateChange', function(day){
  this._currentDayIndex = _.indexOf(this._days, day);
  this._setStartDate();
  this._updateViews();
});

App.controller._setStartDate = function(){
  var startDate = new Date(App.now),
      dayOfMonth =  startDate.getDate();
  startDate.setDate(dayOfMonth - this._days[this._currentDayIndex]);
  this._startDate = startDate;
};
var App = App || {};

App.controller = _.clone(Backbone.Events);

App.controller.start = function(){
  this._days = [1,3,7,14];
  this._periodsForDays = [App.constants.HOUR, App.constants.HOUR * 3, App.constants.HOUR * 6, App.constants.HOUR * 6];
  this._currentDayIndex = 0;
  this._setStartDate();

  var datePickerView = new App.DatePickerView({el: $('#date-picker-view'), days: this._days});
  datePickerView.render();

  this._updateActivityView();
};

App.controller._updateActivityView = function() {
  var subset = App.events.filterByDateRange(this._startDate, App.now),
      sampler = new App.EventSampler(subset, {periodLength: this._periodsForDays[this._currentDayIndex]});

  this._activityView = new App.ActivityView({el: $('#activity-view'), sampler: sampler}),
  this._activityView.render();
};

App.controller.on('dateChange', function(day){
  this._currentDayIndex = _.indexOf(this._days, day);
  this._setStartDate();
  this._updateActivityView();
});

App.controller._setStartDate = function(){
  var startDate = new Date(App.now),
      dayOfMonth =  startDate.getDate();
  startDate.setDate(dayOfMonth - this._days[this._currentDayIndex]);
  this._startDate = startDate;
}
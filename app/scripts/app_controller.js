var App = App || {};

App.controller = _.clone(Backbone.Events);

App.controller.start = function(){
  this._startDate = new Date('2014-07-28');
  this._days = [1,3,7,14];
  this._periodsForDays = [App.constants.HOUR * 3, App.constants.HOUR * 3, App.constants.HOUR * 6, App.constants.HOUR * 6];
  this._currentDayIndex = 0;

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
  var startDate = new Date(App.now),
      dayOfMonth =  startDate.getDate();
  startDate.setDate(dayOfMonth - day);
  this._startDate = startDate;
  this._updateActivityView();
});
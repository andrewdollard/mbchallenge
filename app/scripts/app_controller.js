var App = App || {};

App.controller = _.clone(Backbone.Events);

App.controller.start = function(){
  var hour = 1000 * 60 * 60;
  App.now = new Date('2014-07-31');
  this._days = [1,3,7,14];
  this._periods = [hour, hour * 3, hour * 6, hour * 12];

  this._setDatePredicate(this._days[0]);
  this._segmentPredicate = null;

  this._activityView = new App.ActivityView({el: $('#activity-view')});
  this._segmentView = new App.SegmentView({el: $('#segment-view')});
  this._deviceView = new App.DeviceView({el: $('#device-view')});
  var datePickerView = new App.DatePickerView({el: $('#date-picker-view'), days: this._days});

  this._updateViews();
  datePickerView.render();
};

App.controller.on('dateChange', function(days){
  this._setDatePredicate(days);
  this._updateViews();
});

App.controller.on('segmentChange', function(segment){
  this._segmentPredicate = (segment == 'all') ? null : App.EqualityPredicateFactory('gender', segment);
  this._updateViews();
});

App.controller._updateViews = function() {
  var eventFilter = new App.EventFilter(App.events).addPredicate(this._datePredicate);
  var filtered = eventFilter.filter();

  var segmentSampler = new App.AttributeSampler(filtered, 'gender');

  if (this._segmentPredicate != null) {
    eventFilter.addPredicate(this._segmentPredicate);
    filtered = eventFilter.filter();
  }

  var activitySampler = new App.TimeSampler(filtered, this._period),
      deviceSampler = new App.AttributeSampler(filtered, 'device');

  this._activityView.setSampler(activitySampler);
  this._activityView.render();

  this._segmentView.setSampler(segmentSampler);
  this._segmentView.render();

  this._deviceView.setSampler(deviceSampler);
  this._deviceView.render();
};

App.controller._setDatePredicate = function(days) {
  var index = _.indexOf(this._days, days);
  var startDate = new Date(App.now),
      dayOfMonth =  startDate.getDate();
  startDate.setDate(dayOfMonth - days);
  this._period = this._periods[index];
  this._datePredicate = App.RangePredicateFactory('timestamp', startDate, App.now);
};

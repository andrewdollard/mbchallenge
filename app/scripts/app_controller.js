var App = App || {};

App.controller = _.clone(Backbone.Events);

App.controller.start = function(){
  var subset = App.events.filterByDateRange(new Date('2014-7-28'), App.now),
      sampler = new App.EventSampler(subset, {periodLength: (App.constants.HOUR * 3)}),
      activityView = new App.ActivityView({el: $('#activity-view'), sampler: sampler}),
      datePickerView = new App.DatePickerView({el: $('#date-picker-view'), days: [1, 3, 7, 14]});

  activityView.render();
  datePickerView.render();
};

App.controller.on('dateChange', function(e){
  console.log('date change');
  console.log(e);
});
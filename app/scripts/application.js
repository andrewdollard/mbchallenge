//= require_tree .
var App = App || {};

App.now = new Date('2014-07-31');
App.constants = {
  SECOND: 1000,
  MINUTE: 1000 * 60,
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24
};

App.start = function(){
  var subset = App.events.filterByDateRange(new Date('2014-7-28'), App.now),
      sampler = new App.EventSampler(subset, {periodLength: (App.constants.HOUR * 3)}),
      activityView = new App.ActivityView({el: $('#activity-view'), sampler: sampler});

  activityView.render();
//  _.each(sampler.samples(), function(s){
//    console.log(s.percentActive());
//  });


};


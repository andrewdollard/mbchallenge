var App = App || {};

App.DeviceView = Backbone.View.extend({

  initialize: function(){

  },

  setCollection: function(event_collection) {
    var data = event_collection.byDevice();
    this._data = _(data).map(function(d){ return [d[0], d[1].length] });

  },

  events: {

  },

  render: function(){
    var pie = d3.layout.pie();

    var w = 300;
    var h = 300;

    this.$el.width(w);

    var outerRadius = w / 2;
    var innerRadius = 0;
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    this.$el.empty();
    var svg = d3.select(this.el)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var pieData = _.map(this._data, function(d){ return d[1] });


    var arcs = svg.selectAll("g.arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");


    var color = d3.scale.category10();
    arcs.append("path")
        .attr("fill", function(d, i) {
          return color(i);
        })
        .attr("d", arc);
  }

});
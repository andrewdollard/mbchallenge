var App = App || {};

App.DeviceView = Backbone.View.extend({

  setCollection: function(event_collection) {
    var data = event_collection.byDevice();
    this._data = _(data).map(function(d){ return [d[0], d[1].length] });
  },

  render: function(){
    var padding = [0, 180, 0, 180];
    var self = this;

    var containerWidth = this.$el.width();
    var diameter = containerWidth - padding[1] - padding[3];
    var outerRadius = diameter / 2;
    var labelr = outerRadius + 60;

    var pie = d3.layout.pie();
    var pieData = _.map(this._data, function(d){ return d[1] });
    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(outerRadius);


    this.$el.empty();
    var svg = d3.select(this.el)
        .append("svg")
        .attr("width", containerWidth)
        .attr("height", containerWidth);

    var arcs = svg.selectAll("g.arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (outerRadius + padding[3]) + ", " + (outerRadius + padding[0]) + ")");

    var color = d3.scale.category10();
    arcs.append("path")
        .attr("fill", function(d, i) {
          return color(i);
        })
        .attr("d", arc);

    arcs.append("svg:text")
        .attr("transform", function(d) {
          var c = arc.centroid(d),
              x = c[0],
              y = c[1],
              h = Math.sqrt(x*x + y*y);
          return "translate(" + (x/h * labelr) +  ',' +
              (y/h * labelr) +  ")";
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
              return (d.endAngle + d.startAngle)/2 > Math.PI ?
              "end" : "start";
        })
        .text(function(d, i) { return self._data[i][0] });
  }

});
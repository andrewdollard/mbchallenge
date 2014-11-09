var App = App || {};

App.DeviceView = Backbone.View.extend({

  setSampler: function(sampler) {
    var samples = sampler.samples();
    this._deviceNames = sampler.values();
    var eventCount = sampler.totalLength();

    this._data = _.map(sampler.samples(), function(sample){ return (sample.length / eventCount) * 100 });

    var self = this;
    $(window).on('resize', function(){
      self.render();
    });
  },

  render: function(){
    this._configureDimensions();
    this._draw();
  },

  _configureDimensions: function(){
    this._width = this.$el.width();
    var floatRadiusAdjust;
    if (this._width < 400) {
      this._padding = [30, 70, 0, 70];
      floatRadiusAdjust = 45;
      this._textClass = 'pie-label-small';
    } else {
      this._padding = [40, 110, 0, 110];
      floatRadiusAdjust = 60;
      this._textClass = 'pie-label-large';
    }

    var diameter = this._width - this._padding[1] - this._padding[3];
    this._outerRadius = diameter / 2;
    this._floatingLabelRadius = this._outerRadius + floatRadiusAdjust;
    this._innerLabelRadius = this._outerRadius / 2;
  },

  _draw: function(){
    var self = this;
    var pie = d3.layout.pie();
    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(this._outerRadius);

    this.$el.empty();
    var svg = d3.select(this.el)
        .append("svg")
        .attr("width", this._width)
        .attr("height", this._width);

    var arcs = svg.selectAll("g.arc")
        .data(pie(this._data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (this._outerRadius + this._padding[3]) + ", " + (this._outerRadius + this._padding[0]) + ")");

    var color = d3.scale.category10();

    arcs.each(function(d, i){
      var currentTextWidth,
          wedge = d3.select(this);

      wedge.append("path")
          .attr("fill", function() { return color(i); })
          .attr("d", arc);

      var floatingRect = wedge.append("svg:rect")
          .attr('rx', '5').attr('ry', '5')
          .attr("fill", function() { return color(i); });

      var floatingText = wedge.append("svg:text")
          .attr("transform", function(d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * self._floatingLabelRadius) +  ',' +
                (y/h * self._floatingLabelRadius) +  ")";
          })
          .attr("class", self._textClass)
          .attr("text-anchor", "middle")
          .text(function() {
            return self._deviceNames[i];
          });

      wedge.append("svg:text")
          .attr("transform", function(d) {
            var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                h = Math.sqrt(x*x + y*y);
            return "translate(" + (x/h * self._innerLabelRadius) +  ',' +
                (y/h * self._innerLabelRadius) +  ")";
          })
          .attr("class", self._textClass + ' inner-label')
          .attr("text-anchor", "middle")
          .text(function(d) { return (d.value.toFixed(1) + '%') });

      var rectWidth = floatingText.node().getBBox().width + 20;
      var rectHeight = floatingText.node().getBBox().height + 10;

      floatingRect.attr('width', rectWidth)
                  .attr('height', rectHeight)
                  .attr("transform", function(d) {
                    var c = arc.centroid(d),
                        x = c[0],
                        y = c[1],
                        h = Math.sqrt(x*x + y*y);
                    return "translate(" + ((x/h * self._floatingLabelRadius) - (rectWidth / 2)) +  ',' +
                        ((y/h * self._floatingLabelRadius) - (rectHeight / 2 + 5)) +  ")";
                  });
    });


  }

});
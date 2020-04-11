export default function BarChartCanvas() {}

BarChartCanvas.prototype.updateState = function(d3x, d3y, ctx) {
  const self = this;

  self.d3x = d3x
  self.d3y = d3y
  self.ctx = ctx;
}

BarChartCanvas.prototype.drawBars = function(data) {
  const self = this;

  const d3x = self.d3x,
    d3y = self.d3x,
    ctx = self.ctx;
}

BarChartCanvas.prototype.drawBarText = function(data) {
  const self = this;

  const d3x = self.d3x,
    d3y = self.d3x,
    ctx = self.ctx;
}

BarChartCanvas.prototype.drawBarTextRight = function(data) {
  const self = this;

  const d3x = self.d3x,
    d3y = self.d3x,
    ctx = self.ctx;
}

BarChartCanvas.prototype.drawBarTextLeft = function(data) {
  const self = this;

  const d3x = self.d3x,
    d3y = self.d3x,
    ctx = self.ctx;
}

BarChartCanvas.prototype.drawBarTextDate = function(data) {
  const self = this;

  const d3x = self.d3x,
    d3y = self.d3x,
    ctx = self.ctx;

  function updateDate({date, transition}) {
    const self = this;
    console.log(date)
    self.dom.counter
      .transition()
      .ease(d3.easeLinear)
      .duration(transition)
      .tween("text", function () {
        if (self.counter_type === "date") return self.tweenDate(this, date);
      });

  }

  function tweenDate(counter_node, new_value) {
    const current_value = new Date(counter_node.textContent);
    const i = d3.interpolateDate(current_value, new Date(new_value));
    return function (t) {
      counter_node.textContent = d3.timeFormat("%Y-%m-%d")(i(t))
    };
  }
}

BarChartCanvas.prototype.drawBarTextAxis = function(data) {
  const self = this;

  const d3x = self.d3x,
    d3y = self.d3x,
    ctx = self.ctx;
}


BarChartCanvas.prototype.update = function(iter) {
  const self = this;

  const data = self.data_stash[iter].values;
  self.updateDate(self.data_stash[iter])

  self.d3_x
    .domain([0, d3.max(data, d => d.value)]);

  self.dom.svg_x_axis
    .transition()
    .ease(d3.easeLinear)
    .duration(self.data_stash[iter].transition)
    .call(self.d3_x_axis)

  const bar = self.dom.svg_main_group.selectAll("g.bar")
    .data(data, d => d.name)

  const bar_exit = bar.exit()

  bar_exit
    .transition()
    .ease(d3.easeLinear)
    .duration(self.transition_time)
    .attr("transform", (d, i) => "translate(" + self.dim.node.pic.width + ", " + self.dim.svg.height + ")")
    .on("end", function () {
      this.remove();
    })

  bar_exit.select("rect.bar")
    .transition()
    .ease(d3.easeLinear)
    .duration(self.transition_time)
    .attr("width", () => {
      const d = self.data_stash[iter-1].values[9];
      const w = self.d3_x(d.value)
      return w > 0 ? w : 0
    })

  bar_exit.select("text.name_label")
    .transition()
    .ease(d3.easeLinear)
    .duration(self.transition_time)
    .attr("x", () => {
      const d = self.data_stash[iter-1].values[9];
      return self.d3_x(d.value) - 10;
    })

  bar_exit.select("text.value_label")
    .transition()
    .ease(d3.easeLinear)
    .duration(self.transition_time)
    .attr("x", () => {
      const d = self.data_stash[iter-1].values[9];
      return self.d3_x(d.value) + 3;
    })
    .tween("text", function() {
      const d = self.data_stash[iter-1].values[9];
      const current_value = parseInt(this.textContent.split(",").join(""))
      var i = d3.interpolate(current_value, d.value);

      return function(t) {
        this.textContent = Math.round(i(t)).toLocaleString('en-US');
      };
    });

  const bar_enter = bar
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", (d, i) => "translate(" + self.dim.node.pic.width + ", " + self.dim.svg.height + ")")

  bar_enter.append("rect")
    .attr("class", "bar")
    .style("fill", (d,i) => self.d3_color(d.name))
    .style("opaselfty", 0.93)
    .attr("width", () => {
      const d = self.data_stash[iter > 0 ? iter-1 : 0].values[9];
      const w = self.d3_x(d.value)
      return w > 0 ? w : 0
    })
    .attr("height", self.d3_y.bandwidth())
    .attr("x", 0)

  bar_enter.append("text")
    .attr("class", "value_label")
    .attr("x", () => {
      const d = self.data_stash[iter > 0 ? iter-1 : 0].values[9];
      return self.d3_x(d.value) + 3;
    })
    .attr("y", d => {
      return  self.d3_y.bandwidth() / 2 + 9;
    })
    .style("fill", "white")
    .style("font-weight", "bold")
    .style("font-size", 24)
    .text("0")

  bar_enter.append("text")
    .attr("class", "name_label")
    .attr("clip-path", "url(#bar_clip)")
    .attr("y", d => {
      return self.d3_y.bandwidth() / 2 + 8.5;
    })
    .attr("x", () => {
      const d = self.data_stash[iter > 0 ? iter-1 : 0].values[9];
      return self.d3_x(d.value) - 10;
    })
    .style("text-anchor", "end")
    .style("fill", "white")
    .style("font-size", 26)
    .style("font-weight", "bold")
    .text(d => d.name);

  bar_enter.append("text")
    .attr("class", "type_label")
    .attr("y", d => {
      return self.d3_y.bandwidth() / 2 + 6;
    })
    .attr("x", -6)
    .style("text-anchor", "end")
    .style("fill", "white")
    .style("font-size", 16)
    .style("font-weight", "bold")
    .text(d => d.type);

  const bar_update = bar_enter.merge(bar)

  bar_update
    .transition()
    .ease(d3.easeLinear)
    .duration(self.data_stash[iter].transition)
    .attr("transform", (d,i) => "translate(" + self.dim.node.pic.width + ", " + self.d3_y(i) + ")")


  bar_update.select("rect.bar")
    .transition()
    .ease(d3.easeLinear)
    .duration(self.data_stash[iter].transition)
    .attr("width", d => {
      const w = self.d3_x(d.value)
      return w > 0 ? w : 0
    })

  bar_update.select("text.name_label")
    .transition()
    .ease(d3.easeLinear)
    .duration(self.data_stash[iter].transition)
    .attr("x", d => {
      return self.d3_x(d.value) - 10;
    })


  bar_update.select("text.value_label")
    .transition()
    .ease(d3.easeLinear)
    .duration(self.data_stash[iter].transition)
    .attr("x", d => {
      return self.d3_x(d.value) + 3;
    })
    .tween("text", function(d) {
      const current_value = parseInt(this.textContent.split(",").join(""))
      var i = d3.interpolate(current_value, d.value);

      return function(t) {
        d.i_value = Math.round(i(t));
        this.textContent = d.i_value.toLocaleString('en-US');
      };
    });
}





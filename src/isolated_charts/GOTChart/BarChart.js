
class BarChart {

  constructor() {
    const CI = this;

  }

  initial(base) {
    const CI = this;

    CI.B = base;

    CI.dim = CI.B.dim;

    CI.main_group = d3.select(CI.B.vm.$refs.main_group);

    CI.B.rect_dct = {};
  }

  calculateDims() {
    const CI = this;

    CI.dim.main_group.width = CI.dim.svg.width - CI.dim.margin.left - CI.dim.margin.right;
    CI.dim.main_group.height = CI.dim.svg.height - CI.dim.margin.top - CI.dim.margin.bottom;

    CI.dim.main_pic.width = CI.dim.main_group.height/1.8
    CI.dim.main_pic.height = CI.dim.main_group.height/1.8



    CI.d3_y = d3.scaleBand()
      .range([CI.dim.main_group.height * 100/15, 0])
      .domain(d3.range(100).map((d,i) => i).reverse())
      .padding(0.1);

    CI.dim.node.pic.width = 150;

    CI.dim.node.bar.width = CI.dim.main_group.width - CI.dim.node.pic.width - CI.dim.node.value_label.width;

    CI.d3_x = d3.scaleLinear()
      .range([0, CI.dim.node.bar.width])
      .domain(0, 100)

    d3.select(CI.B.vm.$refs.x_axis)
      .attr("transform", "translate(" + CI.dim.node.pic.width + "," + (CI.dim.main_group.height + 6) + ")")

    CI.d3_x_axis = d3.axisBottom(CI.d3_x).ticks(7)
      // .tickFormat(n => d3.formatPrefix(".0", 1e6)(n).replace("G", "B"));

    CI.d3_x
      .domain([-100, d3.max(CI.B.data_stash.slice(-1)[0].values, d => d.value)]);

    console.log(CI.d3_x.domain())

  }

  rectSwitcher() {
    const CI = this;

    setInterval(() => {

    }, 500)
  }

  updateRectDct(iter) {
    const CI = this;

    // const data = CI.B.data_stash[iter].values;

    CI.B.rect_dct = {};
    CI.B.rect_offset = {x:CI.dim.margin.left+CI.dim.node.pic.width, y:CI.dim.margin.top}
    CI.B.rect_default = [CI.B.rect_offset.x, CI.B.rect_offset.y+CI.dim.svg.height];
    CI.B.rect_height = CI.d3_y.bandwidth();

    CI.main_group.selectAll("g.bar")
      .each(function (datum) {
        CI.B.rect_dct[datum.name] = {selection: d3.select(this), coor: []}
      })

  }

  update(iter) {
    const CI = this;

    const data = CI.B.data_stash[iter].values;

    // CI.d3_x
    //   .domain([0, d3.max(data, d => d.value)]);

    d3.select(CI.B.vm.$refs.x_axis)
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.data_stash[iter].transition)
      .call(CI.d3_x_axis);

    const bar = CI.main_group.selectAll("g.bar")
      .data(data, d => d.name);

    const bar_exit = bar.exit()

    bar_exit
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.transition_time)
      .attr("transform", (d, i) => "translate(" + CI.dim.node.pic.width + ", " + CI.dim.svg.height + ")")
      .on("end", function () {
        this.remove();
      })

    bar_exit.select("rect.bar")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.transition_time)
      .attr("width", () => {
        const d = CI.B.data_stash[iter-1].values[9];
        const w = CI.d3_x(d.value)
        return w > 0 ? w : 0
      })

    bar_exit.select("text.name_label")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.transition_time)
      .attr("x", () => {
        const d = CI.B.data_stash[iter-1].values[9];
        return CI.d3_x(d.value) - 10;
      })

    bar_exit.select("text.value_label")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.transition_time)
      .attr("x", () => {
        const d = CI.B.data_stash[iter-1].values[9];
        return CI.d3_x(d.value) + 3;
      })
      .tween("text", function() {
        const d = CI.B.data_stash[iter-1].values[9];
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
      .attr("transform", (d, i) => "translate(" + CI.dim.node.pic.width + ", " + CI.dim.svg.height + ")")

    bar_enter.append("rect")
      .attr("class", "bar")
      .style("fill", (d,i) => d.color)
      .style("opacity", 0.93)
      .attr("width", () => {
        const d = CI.B.data_stash[iter > 0 ? iter-1 : 0].values[9];
        const w = CI.d3_x(d.value)
        return w > 0 ? w : 0
      })
      .attr("height", CI.d3_y.bandwidth())
      .attr("x", 0)

    bar_enter.append("text")
      .attr("class", "value_label")
      .attr("x", () => {
        const d = CI.B.data_stash[iter > 0 ? iter-1 : 0].values[9];
        return CI.d3_x(d.value) + 3;
      })
      .attr("y", d => {
        return  CI.d3_y.bandwidth() / 2 + 9;
      })
      .style("fill", "white")
      .style("font-weight", "bold")
      .style("font-size", 24)
      .text("0")

    bar_enter.append("text")
      .attr("class", "name_label")
      .attr("clip-path", "url(#bar_clip)")
      .attr("y", d => {
        return CI.d3_y.bandwidth() / 2 + 8.5;
      })
      .attr("x", () => {
        const d = CI.B.data_stash[iter > 0 ? iter-1 : 0].values[9];
        return CI.d3_x(d.value) - 10;
      })
      .style("text-anchor", "end")
      .style("fill", "white")
      .style("font-size", 26)
      .style("font-weight", "bold")
      .text(d => d.name);

    bar_enter.append("text")
      .attr("class", "type_label")
      .attr("y", d => {
        return CI.d3_y.bandwidth() / 2 + 6;
      })
      .attr("x", -6)
      .style("text-anchor", "end")
      .style("fill", "white")
      .style("font-size", 16)
      .style("font-weight", "bold")
      .text(d => d.type);

    bar_enter.append('image')
      .attr("xlink:href", function(d) {
          return "{}".replace("{}", d.image_url);
      })
      .attr("x", -CI.d3_y.bandwidth() - 3)
      .attr("width", CI.d3_y.bandwidth())
      .attr("height", CI.d3_y.bandwidth())
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("class", "rukavica")
      .style("border-radius", "5em");

    const bar_update = bar_enter.merge(bar)

    bar_update
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.data_stash[iter].transition)
      .attr("transform", (d,i) => "translate(" + CI.dim.node.pic.width + ", " + CI.d3_y(i) + ")")


    bar_update.select("rect.bar")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.data_stash[iter].transition)
      .attr("width", d => {
        const w = CI.d3_x(d.value)
        return w > 0 ? w : 0
      })

    bar_update.select("text.name_label")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.data_stash[iter].transition)
      .attr("x", d => {
        return CI.d3_x(d.value) - 10;
      })


    bar_update.select("text.value_label")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.B.data_stash[iter].transition)
      .attr("x", d => {
        return CI.d3_x(d.value) + 3;
      })
      .tween("text", function(d) {
        const current_value = parseInt(this.textContent.split(",").join("").replace(" min", ""))
        var i = d3.interpolate(current_value, d.value);

        return function(t) {
          d.i_value = Math.round(i(t));
          this.textContent = d.i_value.toLocaleString('en-US') + " min";
        };
      });

    CI.updateRectDct(iter);



    // d3.select(".main_image")
    //   .attr("xlink:href", function() {
    //     const label = data.values.slice(-1)[0].label;
    //     return "/static/top12_data/insta_profile_pic/{}.jpg".replace("{}", label);
    //   })

  }

}

export default new BarChart();

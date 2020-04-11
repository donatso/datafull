export default class BarChart {

  constructor(cont) {
    const CI = this;
    CI.dom = {};
    CI.dom.cont = d3.select(cont);

    CI.data_stash = [];
    CI.transition_time = 1000;
    CI.animation_time = 360*1000;
    CI.current_date = ""
    CI.initialized = false;

    CI.interpolate = true;
    CI.counter_type = "date";

    CI.initial()
  }

  createElements() {
    const CI = this;

    CI.dom.cont.html("")
    CI.dom.cont = CI.dom.cont.attr("class", "chart_cont")
    CI.dom.start_btn = CI.dom.cont.append("button").attr("class", "start").html("start").on("click", CI.start.bind(CI))
    CI.dom.counter = CI.dom.cont.append("div").attr("class", "date").append("h1")
    CI.dom.svg = CI.dom.cont.append("svg")
    CI.dom.svg_defs = CI.dom.svg.append("defs")

    CI.dom.svg_focus = CI.dom.svg.append("g")
    CI.dom.svg_main_group = CI.dom.svg_focus.append("g").attr("clip-path", 'url(#main_clip)')
    CI.dom.svg_x_axis = CI.dom.svg_focus.append("g").attr("clip-path", 'url(#xaxis_clip)')
  }

  updateElements() {
    const CI = this;
    const dim = CI.dim;

    CI.dom.svg.attr("width", dim.svg.width)
    CI.dom.svg.attr("height", dim.svg.height)
    CI.dom.svg_focus.attr("transform", 'translate(' + dim.margin.left + ', ' + dim.margin.top + ')')
    CI.dom.svg_x_axis
      .attr("transform", "translate(" + CI.dim.node.pic.width + "," + (CI.dim.main_group.height + 6) + ")")

    CI.dom.svg_defs.node().innerHTML = `
        <clipPath id="main_clip">
          <rect
            x="0" y="0"
            width="${dim.main_group.width+150}"
            height="${dim.main_group.height}"
          ></rect>
        </clipPath>
        <clipPath id="bar_clip">
          <rect
            x="0" y="0"
            width="${dim.main_group.width}"
            height="${dim.main_group.height}"
          ></rect>
        </clipPath>
        <clipPath id="xaxis_clip">
          <rect
            x="-40" y="-10"
            width="${dim.node.bar.width+60}"
            height="90"
          ></rect>
        </clipPath>
    `
  }

  initial() {
    const CI = this;

    CI.createElements()
    CI.calculateDims();
    CI.updateElements();
    CI.setupColors()
    CI.prepareData();
    CI.setupAxis();
  }

  setupColors() {
    const CI = this;

    const color =
      [
        "#FFC000",
        "#9966CC",
        "#007FFF",
        "#0000FF",
        "#0095B6",
        "#964B00",
        "#800020",
        "#B87333",
        "#008000",
        "#50C878",
        "#00A86B",
        "#000080",
        "#FF6600",
        "#FF4500",
        "#003153",
        "#FF0000",
        "#7F00FF",
        "#808080",
        "#009000",
        "#32B141",
      ]

    CI.d3_color = d3.scaleOrdinal()
      .range(color)
  }

  setUploadedCsv(data) {
    const CI = this;
    CI.raw_data = data;
  }

  calculateDims() {
    const CI = this;

    CI.dim = {
      svg: CI.dom.cont.node().getBoundingClientRect(),
      main_group: {},
      margin: {
        top: 120,
        right: 150,
        bottom: 60,
        left: 25
      },
      node: {
        pic: {width: 0},
        bar: {width: 0},
        value_label: {width: 130}
      },
      is_mobile: window.innerWidth < 600,
    }

    CI.dim.main_group.width = CI.dim.svg.width - CI.dim.margin.left - CI.dim.margin.right;
    CI.dim.main_group.height = CI.dim.svg.height - CI.dim.margin.top - CI.dim.margin.bottom;

    CI.dim.node.pic.width = 150;

    CI.dim.node.bar.width = CI.dim.main_group.width - CI.dim.node.pic.width - CI.dim.node.value_label.width;
  }


  dataInterpolateByDate() {
    const CI = this;

    const data_by_name = {};
    const start_time = new Date(CI.data_stash[0].date).getTime();
    const end_time = new Date(CI.data_stash[CI.data_stash.length-1].date).getTime();
    const full_data_time = end_time - start_time
    const animation_time = CI.animation_time;
    const time_cut = CI.transition_time;
    const time_points_len = (animation_time/time_cut)
    const transition_scale = animation_time / full_data_time;
    const time_point = Math.floor(full_data_time / (animation_time/time_cut))
    CI.data_stash.forEach((datum1, iter) => {
      datum1.values.forEach(datum => {
        if (!data_by_name.hasOwnProperty(datum.name)) data_by_name[datum.name] = {values:d3.range(animation_time/time_cut).map(() => 0), type: datum.type};
        const interpolate_time =  Math.floor((((datum1.datedate - start_time) / full_data_time) * animation_time) / time_cut) -1 // TODO: why -1
        data_by_name[datum.name].values[interpolate_time] = datum.value
      })
    })

    Object.keys(data_by_name).forEach(k => {
      const values = data_by_name[k].values;
      let filled_values = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i] !== 0) filled_values.push(i)
      }
      filled_values.forEach((_, iter) => {
        if (iter === filled_values.length-1) return
        let i = filled_values[iter]
        let inext = filled_values[iter+1]
        const dist_between_values = inext - i;
        const interpolate_value = (values[inext] - values[i]) / dist_between_values;
        for (let j = 0; j < dist_between_values; j++) {
          values[i+j] = values[i]+(j*interpolate_value)
        }
      })
    })

    const data_dct = {};
    d3.range(animation_time/time_cut).forEach((n,i) => {
      let date = start_time+(full_data_time*(i/(time_points_len-1)));
      date = d3.timeFormat("%Y-%m-%d")(date);
      data_dct[date] = {date: date, values: []}
    })

    Object.keys(data_by_name).forEach(k => {
      const values = data_by_name[k].values;
      const type = data_by_name[k].type
      values.forEach((n,i) => {
        let date = start_time+(full_data_time*(i/(time_points_len-1)));
        date = d3.timeFormat("%Y-%m-%d")(date);
        data_dct[date].values.push({name: k, value: n, type: type})
      })
    })

    CI.data_stash = Object.values(data_dct);

  }


  prepareData(data) {
    const CI = this;

    CI.getYoutubeData();

  }

  getYoutubeData() {
    const CI = this;

    if (!CI.raw_data) {
      d3.dsv(';', './data/views.csv')
        .then(function(data) {
          CI.prepareYoutubeViewsData(data)
        })
    } else {
      const dsv = d3.dsvFormat(';')
      const data = dsv.parse(CI.raw_data)
      CI.prepareYoutubeViewsData(data)
    }
  }

  prepareYoutubeViewsData(data) {
    const CI = this;

    CI.data_stash = [];
    const data_dct = {}
    data.forEach(datum => {
      let dt = datum.date.split(".");
      datum.date = [dt[1], dt[0], dt[2]].join("/");

      if (!data_dct.hasOwnProperty(datum.date)) data_dct[datum.date] = {date: datum.date, datedate: new Date(datum.date), values: [], transition: 2000};
      if (typeof datum.value === "string") datum.value = datum.value.replace(/,/g, "")
      datum.value = parseInt(datum.value);
      data_dct[datum.date].values.push(datum)
    })

    CI.data_stash = Object.values(data_dct);

    CI.sortByKey(CI.data_stash, "datedate")

    if (CI.interpolate) {
      CI.dataInterpolateByDate();
      CI.data_stash.forEach(datum => {
        datum.transition = CI.transition_time;
      })
    } else {
      const transition_scale = CI.animation_time / (new Date(CI.data_stash[CI.data_stash.length-1].date) - new Date(CI.data_stash[0].date))
      const date_diff = []
      CI.data_stash.forEach((datum, iter) => {
        let transition = CI.transition_time;
        if (iter !== 0) {
          date_diff.push((new Date(CI.data_stash[iter].date) - new Date(CI.data_stash[iter-1].date)))
          transition = transition_scale * (new Date(CI.data_stash[iter].date) - new Date(CI.data_stash[iter-1].date));
          datum.transition = transition;
        }

      })
    }

    // cut remainder
    CI.data_stash.forEach((datum, iter) => {
      CI.sortByKey(datum.values, "value")
      datum.values.reverse();
      datum.values = datum.values.slice(0, 20)
    });
    // </end> cut remainder
  }

  start() {
    const CI = this;

    if (!CI.hasOwnProperty('running')) {
      CI.iter = 0;
      CI.dom.counter.html(CI.data_stash[CI.iter].date)
      CI.dom.start_btn.html("stop")

      CI.running = true;
      CI.run()
    } else if (CI.running) {
      CI.dom.start_btn.html("start")

      CI.running = false;
    } else if (!CI.running) {
      CI.dom.start_btn.html("stop")

      CI.running = true
      CI.run()
    }
  }

  run() {
    const CI = this;

    const sleep = m => new Promise(r => setTimeout(r, m));
    (async() => {
      for (;CI.iter < CI.data_stash.length; CI.iter++) {
        if (CI.running === false) break

        CI.update(CI.iter);
        console.log(CI.update)
        await sleep(CI.data_stash[CI.iter].transition);
      }
    })();

  }

  updateDate({date, transition}) {
    const CI = this;
    console.log(date)
    CI.dom.counter
      .transition()
      .ease(d3.easeLinear)
      .duration(transition)
      .tween("text", function () {
        if (CI.counter_type === "date") return CI.tweenDate(this, date);
      });

  }

  tweenDate(counter_node, new_value) {
    const current_value = new Date(counter_node.textContent);
    const i = d3.interpolateDate(current_value, new Date(new_value));
    return function (t) {
      counter_node.textContent = d3.timeFormat("%Y-%m-%d")(i(t))
    };
  }

  sortByKey(data, key) {
    function sortBy(a, b) {
      if (a[key] < b[key])
        return -1;
      if (a[key] > b[key])
        return 1;
      return 0;
    }
    return data.sort(sortBy)
  }

  setupAxis() {
    const CI = this;

    CI.d3_y = d3.scaleBand()
      .range([CI.dim.main_group.height * 100/10, 0])
      .domain(d3.range(100).map((d,i) => i).reverse())
      .padding(0.1);

    CI.d3_x = d3.scaleLinear()
      .range([0, CI.dim.node.bar.width])
      .domain(0, 100)

    CI.d3_x_axis = d3.axisBottom(CI.d3_x).ticks(7).tickFormat(n => d3.formatPrefix(".0", 1e6)(n).replace("G", "B"));

  }

  update(iter) {
    const CI = this;

    const data = CI.data_stash[iter].values;
    CI.updateDate(CI.data_stash[iter])

    CI.d3_x
      .domain([0, d3.max(data, d => d.value)]);

    CI.dom.svg_x_axis
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.data_stash[iter].transition)
      .call(CI.d3_x_axis)

    const bar = CI.dom.svg_main_group.selectAll("g.bar")
      .data(data, d => d.name)

    const bar_exit = bar.exit()

    bar_exit
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.transition_time)
      .attr("transform", (d, i) => "translate(" + CI.dim.node.pic.width + ", " + CI.dim.svg.height + ")")
      .on("end", function () {
        this.remove();
      })

    bar_exit.select("rect.bar")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.transition_time)
      .attr("width", () => {
        const d = CI.data_stash[iter-1].values[9];
        const w = CI.d3_x(d.value)
        return w > 0 ? w : 0
      })

    bar_exit.select("text.name_label")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.transition_time)
      .attr("x", () => {
        const d = CI.data_stash[iter-1].values[9];
        return CI.d3_x(d.value) - 10;
      })

    bar_exit.select("text.value_label")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.transition_time)
      .attr("x", () => {
        const d = CI.data_stash[iter-1].values[9];
        return CI.d3_x(d.value) + 3;
      })
      .tween("text", function() {
        const d = CI.data_stash[iter-1].values[9];
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
      .style("fill", (d,i) => CI.d3_color(d.name))
      .style("opacity", 0.93)
      .attr("width", () => {
        const d = CI.data_stash[iter > 0 ? iter-1 : 0].values[9];
        const w = CI.d3_x(d.value)
        return w > 0 ? w : 0
      })
      .attr("height", CI.d3_y.bandwidth())
      .attr("x", 0)

    bar_enter.append("text")
      .attr("class", "value_label")
      .attr("x", () => {
        const d = CI.data_stash[iter > 0 ? iter-1 : 0].values[9];
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
        const d = CI.data_stash[iter > 0 ? iter-1 : 0].values[9];
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

    const bar_update = bar_enter.merge(bar)

    bar_update
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.data_stash[iter].transition)
      .attr("transform", (d,i) => "translate(" + CI.dim.node.pic.width + ", " + CI.d3_y(i) + ")")


    bar_update.select("rect.bar")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.data_stash[iter].transition)
      .attr("width", d => {
        const w = CI.d3_x(d.value)
        return w > 0 ? w : 0
      })

    bar_update.select("text.name_label")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.data_stash[iter].transition)
      .attr("x", d => {
        return CI.d3_x(d.value) - 10;
      })


    bar_update.select("text.value_label")
      .transition()
      .ease(d3.easeLinear)
      .duration(CI.data_stash[iter].transition)
      .attr("x", d => {
        return CI.d3_x(d.value) + 3;
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


}

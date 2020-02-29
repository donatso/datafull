import BarChart from "../../index.js";

import helper from "../../../../../helper/index.js"
import Selector from "../../../../elements/Selector.js"


export default function BasicBarChart(cont, options, store) {

  const self = this;

  self.root_cont = d3.select(cont);
  self.options = options;
  self.style = self.options.style;
  self.store = store;

  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.style.dim, self.resize.bind(self));
    else return self.root_cont.append("div")
  })();

  self.setupEventListeners();
  self.setupConfiguration();

  self.create();
  self.setupDims();
  self.updateElements();

}

BasicBarChart.prototype.setupEventListeners = function() {
  const self = this;

  self.store.event.on("all", function () {
    self.redraw()
  })
}

BasicBarChart.prototype.create = function () {
  const self = this;
  BarChart.chart.create(self.main_cont);
}

BasicBarChart.prototype.redraw = function() {
  const self = this;
  const data = self.store.data.active_data,
    bar_data = helper.time.timeit(() => BarChart.data.prepareData(data, self.options.configuration), "preparebardata")()
  BarChart.chart.draw(bar_data, self.main_cont, self.dim)
}

BasicBarChart.prototype.setupDims = function () {
  const self = this;
  self.dim = BarChart.chart.setupDims(self.main_cont)
}

BasicBarChart.prototype.updateElements = function () {
  const self = this;
  BarChart.chart.updateElements(self.main_cont, self.dim)
}

BasicBarChart.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

BasicBarChart.prototype.setupConfiguration = function() {
  const self = this;
  const config_cont = self.main_cont.append("div").style("position", "relative").style("z-index", "2").append("div")
  config_cont.style("position", "absolute").style("left", "0").style("top", "20px").style("z-index", "1");
  const treat_as_options = [
    { value: "string" },
    { value: "number" },
    { value: "date" },
    { value: "list", input: {placeholder: "separator"} }
  ];
  self.options.configuration = _.defaultsDeep(self.options.configuration, {
    x_axis:{options: [], value: null, treat_as: {options: treat_as_options, value: null, input: {value: null}}},
    y_axis:{options: [], value: null, treat_as: {options: treat_as_options, value: null, input: {value: null}}},
    type:{options: Object.keys(BarChart.data.calculations), value: null},

    onChange: self.redraw.bind(self),
    slice: 10,
    excluded: ["other"]
  })

  function reConfigure(){
    config_cont.html("")
    const config_node = BarChart.configuration.create(self.options.configuration);
    config_cont.node().appendChild(config_node)
  }

  self.store.event.on("data_change", function () {
    const keys = self.store.data.datum_keys;
    self.options.configuration.x_axis.options = keys;
    self.options.configuration.y_axis.options = keys;

    reConfigure();
  })
}


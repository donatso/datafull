import BarChart from "../../index.js";
import helper from "../../../../../helper/index.js"


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
  const bar_data = self.prepareData()
  BarChart.chart.draw(bar_data, self.main_cont, self.dim)
}

BasicBarChart.prototype.prepareData = function() {
  const self = this;
  let data = self.store.data.active_data,
    bar_data = BarChart.data.setupBarData(data, self.options.configuration);

  bar_data = bar_data.sort((a,b) => b.value - a.value)
  bar_data = bar_data.slice(0, 10)

  return bar_data
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
  const config_cont = self.main_cont.append("div").style("margin-top", "10px").style("position", "absolute")

  self.options.configuration = _.defaultsDeep(self.options.configuration, {
    onChange: self.redraw.bind(self),
    type:{options: Object.keys(BarChart.data.calculations)}
  }, BarChart.configuration.configuration_default)

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


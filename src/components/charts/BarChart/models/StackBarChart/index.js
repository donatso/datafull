import BarChart from "../../index.js";
import helper from "../../../../../helper/index.js"


export default function StackBarChart(cont, options, store) {

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

StackBarChart.prototype.setupEventListeners = function() {
  const self = this;

  self.store.event.on("all", function () {
    self.redraw()
  })
}

StackBarChart.prototype.create = function () {
  const self = this;
  BarChart.chart.create(self.main_cont);
}

StackBarChart.prototype.redraw = function() {
  const self = this;
  const data = self.store.data.active_data,
    bar_data = self.prepareData(data)
  BarChart.chart.draw(bar_data, self.main_cont, self.dim)
}

StackBarChart.prototype.prepareData = function(data) {
  const self = this;
  let bar_stack_data = BarChart.data.setupStackBarData(data, self.options.configuration)
  bar_stack_data = bar_stack_data.sort((a,b) => b.y_values_total - a.y_values_total)
  bar_stack_data = bar_stack_data.slice(0, 10)
  console.log(bar_stack_data)

  return bar_stack_data
}

StackBarChart.prototype.setupDims = function () {
  const self = this;
  self.dim = BarChart.chart.setupDims(self.main_cont)
}

StackBarChart.prototype.updateElements = function () {
  const self = this;
  BarChart.chart.updateElements(self.main_cont, self.dim)
}

StackBarChart.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

StackBarChart.prototype.setupConfiguration = function() {
  const self = this;
  const config_cont = self.main_cont.append("div").style("margin-top", "10px").style("position", "absolute")

  self.options.configuration = _.defaultsDeep(self.options.configuration, {
    onChange: self.redraw.bind(self),
    type:{options: BarChart.data.calculation_types},
    slice: 0
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

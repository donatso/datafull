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
  const bar_stack_data_dct = {}

  self.options.configuration.y_axis.forEach(y_axis_config => {
    const config = createDummyConfig(y_axis_config)
    const bar_data = BarChart.data.prepareData(data, config)
    console.log(bar_data)
    appendRectYvalueToYvalues(bar_data)
  })

  let bar_stack_data = Object.values(bar_stack_data_dct)
  bar_stack_data = bar_stack_data.sort((a,b) => b.values_total - a.values_total)
  sliceToOther(10)
  console.log(bar_stack_data)
  return bar_stack_data

  function createDummyConfig(d) {
    const config = _.clone(self.options.configuration, true)
    config.y_axis = d
    return config
  }

  function appendRectYvalueToYvalues(bar_data) {
    bar_data.forEach(d => {
      let node = findOrCreateNode(d);
      node.values.push(d)
      node.values_total += d.value
    })
  }

  function findOrCreateNode(datum) {
    if (!bar_stack_data_dct.hasOwnProperty(datum.label)) {
      bar_stack_data_dct[datum.label] = {label: datum.label, values: [], values_total: 0}
    }
    return bar_stack_data_dct[datum.label]
  }

  function sliceToOther(slice) {
    const other = {label: "other", values: [], values_total: 1};
    // TODO
    bar_stack_data = bar_stack_data.slice(0, slice)
    if (other.value > 0) bar_stack_data.push(other);
  }
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
    type:{options: Object.keys(BarChart.data.calculations)},
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


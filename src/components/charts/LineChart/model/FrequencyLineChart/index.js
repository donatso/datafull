import LineChartModel from "../index.js";
import LineChart from "../../index.js";
import helper from "../../../../../helper/index.js"

export default function FrequencyLineChart(cont, options, store) {
  const self = this;
  LineChartModel.call(self, cont, options, store)
}

FrequencyLineChart.prototype = Object.create(LineChartModel.prototype)

FrequencyLineChart.prototype.prepareData = function() {
  const self = this;
  const data = self.store.data.active_data;

  let adapted_data;
  adapted_data = helper.manipulation.frequency.createFrequencyData(data, self.options.configuration.x_axis.key, self.options)
  adapted_data = helper.manipulation.classify.classifiedToXaxisYaxisStructureArray(adapted_data, self.options.configuration.x_axis.getter, "frequency");
  adapted_data.sort((a, b) => b.x_value - a.x_value)
  adapted_data = {"_": adapted_data}

  return adapted_data
}


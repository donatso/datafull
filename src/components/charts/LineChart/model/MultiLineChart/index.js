import helper from "../../../../../helper/index.js";
import LineChartModel from "../index.js";
import LineChart from "../../index.js";

export default function MultiLineChart(cont, options, store) {
  const self = this;
  LineChartModel.call(self, cont, options, store)
}

MultiLineChart.prototype = Object.create(LineChartModel.prototype)

LineChartModel.prototype.prepareData = function() {
  const self = this;
  const data = self.store.data.active_data;

  return LineChart.data.setupMultiLineData(data, self.options.configuration)
}


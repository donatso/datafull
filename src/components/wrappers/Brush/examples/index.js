import helper from "../../../../helper/index.js";
import Brush from "../index.js"
import BasicLineChart from "../../../charts/LineChart/models/BasicLineChart/index.js";

function LineBrush(cont, options, store) {
  const self = this;
  BasicLineChart.call(this, cont, options, store)
  self._brush = new Brush(store)
  self.first_draw = true
}
LineBrush.prototype = Object.create(BasicLineChart.prototype)

LineBrush.prototype.redraw = function() {
  const self = this;
  if (self.first_draw) BasicLineChart.prototype.redraw.call(self)
  self.first_draw = false

  console.log(self.store.data.active_data.length)
  self._brush.create(self.d3x, self.options.configuration.x_axis.value, self.main_cont, self.dim)
}


export default function() {
  return helper.dashboard_templates.basic({
    data_url: "/data/USvideos.tsv",
    chartModel: LineBrush,
    options: {
      style: { pos: [0.02, 0.7, 0.7, 0.02] },
      resizable: true,
      configuration: {
        x_axis: { value: "views", treat_as: { value: "number" } },
        y_axis: { value: "__frequency", treat_as: { value: "number" } }
      }
    }
  });
}

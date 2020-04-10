import Brush from "../../index.js"
import FrequencyLineChart from "../../../../charts/LineChart/model/FrequencyLineChart/index.js";

function LineBrush(cont, options, store) {
  const self = this;
  FrequencyLineChart.call(this, cont, options, store)
  self._brush = new Brush(store)
  self.first_draw = true
}
LineBrush.prototype = Object.create(FrequencyLineChart.prototype)

LineBrush.prototype.redraw = function() {
  const self = this;
  if (self.first_draw) FrequencyLineChart.prototype.redraw.call(self)
  self.first_draw = false

  console.log(self.store.data.active_data.length)
  self._brush.create(self.d3x, self.options.configuration.x_axis.key, self.main_cont, self.dim)
}

export default LineBrush;
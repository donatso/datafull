import helper from "../../../../helper/index.js"

function setupLineData(data, configuration) {
  return helper.manipulation.classify.group(data, configuration.cls.getter, configuration.x_axis.getter)
}

function setupFrequencyData(data, configuration) {
  data = helper.manipulation.frequency.createFrequencyData(data, configuration.x_axis.value, self.options)
  data = helper.manipulation.classify.classifiedToXaxisYaxisStructureArray(data, configuration.x_axis.value, "frequency");
  data.sort((a, b) => b.x_value - a.x_value)
  return data
}

export default {
  setupLineData,
  setupFrequencyData
}

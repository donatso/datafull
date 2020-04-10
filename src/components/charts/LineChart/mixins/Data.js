import helper from "../../../../helper/index.js"

function setupOneLineData(data, configuration) {
  const grouped = helper.manipulation.classify.group(data, configuration.x_axis.getter)
  const data_struct = []
  for (let k in grouped) {
    if (!grouped.hasOwnProperty(k)) continue
    data_struct.push({
      x_value: k,
      y_value: helper.manipulation.classify.dataToValueCalculations[configuration.type](grouped[k], configuration.y_axis.getter)
    })
  }
  helper.manipulation.treatValues(data_struct, "x_value", configuration.x_axis.type, configuration.x_axis)
  helper.manipulation.treatValues(data_struct, "y_value", configuration.y_axis.type)
  return data_struct
}

function setupMultiLineData(data, configuration) {
  const grouped = helper.manipulation.classify.group(data, configuration.cls.getter)
  for (let cls in grouped) {
    if (!grouped.hasOwnProperty(cls)) continue
    grouped[cls] = setupOneLineData(grouped[cls], configuration)
  }
  return grouped
}

function setupFrequencyData(data, configuration) {
  data = helper.manipulation.frequency.createFrequencyData(data, configuration.x_axis.value, self.options)
  data = helper.manipulation.classify.classifiedToXaxisYaxisStructureArray(data, configuration.x_axis.value, "frequency");
  data.sort((a, b) => b.x_value - a.x_value)
  return data
}

export default {
  setupFrequencyData,
  setupOneLineData,
  setupMultiLineData
}

import helper from "../../../../helper/index.js"

function setupLineData(data, configuration) {
  let classified = helper.manipulation.classify.classifyData(data, configuration.cls.value, configuration.cls.treat_as);
  classified = helper.manipulation.classify.classifyData3(classified, configuration.x_axis.value, configuration.y_axis.value)
  for (let k in classified) {
    if (!classified.hasOwnProperty(k)) continue
    classified[k] = helper.manipulation.treatValues(classified[k], "x_value", configuration.x_axis.treat_as.value, configuration.x_axis.treat_as)
    classified[k] = helper.manipulation.treatValues(classified[k], "y_value", configuration.y_axis.treat_as.value, configuration.y_axis.treat_as)
  }

  return classified;
}

export default {
  setupLineData
}

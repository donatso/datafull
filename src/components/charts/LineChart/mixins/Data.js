import helper from "../../../../helper/index.js"

function setupLineData(data, configuration) {
  const [x_key, y_key, calculation_type, x_axis_treat_as] = [
    configuration.x_axis.value,
    configuration.y_axis.value,
    configuration.type.value,
    configuration.x_axis.treat_as
  ];
  let classified = helper.manipulation.classify.classifyData(data, x_key, y_key, x_axis_treat_as);
  classified = helper.manipulation.classify.classifiedDatumsToValue(classified, y_key, calculation_type)
  classified = helper.manipulation.classify.classifiedToXaxisYaxisStructureArray(classified, x_key, y_key)

  return classified;
}

export default {
  setupLineData
}

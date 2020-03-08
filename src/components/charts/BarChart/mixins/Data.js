import helper from '../../../../helper/index.js'

const calculation_types = Object.keys(helper.manipulation.classify.arrayOfValuesToValueCalculations)

function setupBarData(data, configuration) {
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

function setupStackBarData(data, configuration) {
  const bar_stack_data_dct = {};

  configuration.y_axis.forEach(y_axis_config => {
    const config = createDummyConfig(y_axis_config)
    const bar_data = setupBarData(data, config)
    appendRectYvalueToYvalues(bar_data)
  })

  return Object.values(bar_stack_data_dct)

  function createDummyConfig(d) {
    const config = _.cloneDeep(configuration)
    config.y_axis = d
    return config
  }

  function appendRectYvalueToYvalues(bar_data) {
    bar_data.forEach(d => {
      let node = findOrCreateNode(d);
      node.y_values.push(d)
      node.y_values_total += d.y_value
    })
  }

  function findOrCreateNode(datum) {
    if (!bar_stack_data_dct.hasOwnProperty(datum.x_value)) {
      bar_stack_data_dct[datum.x_value] = {x_value: datum.x_value, x_key: datum.x_key, y_values: [], y_values_total: 0}
    }
    return bar_stack_data_dct[datum.x_value]
  }
}

export default {
  calculation_types,
  setupBarData,
  setupStackBarData
}

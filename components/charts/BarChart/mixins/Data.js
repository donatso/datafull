const calculations = {}

calculations.count = function (values) {
  return values.length;
}

calculations.total = function (values) {
  return _.sum(values)
}

calculations.medium = function (values) {
  const non_null_values = values.filter(v => v !== null);
  return _.sum(non_null_values) / non_null_values.length;
}

function structureData(data, x_key, y_key, x_axis_treat_as) {
  let classified = classify(data, x_key)

  return Object.keys(classified)
    .map(k => ({
      x_key,
      x_value: k,

      y_key,
      y_values: classified[k].map(d => y_key ? (parseFloat(d[y_key]) || 0) : null)
    }))

  function classify(data, key) {
    console.log(key)
    const classDict = {}
    data.forEach(d => {
      if (x_axis_treat_as.value === "list") strToList(d[key], x_axis_treat_as.input.value).forEach(cls => push(cls, d))
      else push(d[key], d)
    })
    return classDict

    function push(cls, value) {
      if (!classDict.hasOwnProperty(cls)) classDict[cls] = []
      classDict[cls].push(value)
    }

    function strToList(str, separator) {
      if (!str || !separator) return []
      return str.split(separator)
    }
  }
}

function createOther(data, x_key, slice) {
  const other = {
    x_key,
    x_value: "other",
    y_key: null,
    y_value: data.reduce(
      (previousValue, d, currentIndex) =>
        previousValue + (currentIndex < slice ? 0 : d.y_value),
      0
    )
  };
  return other
}

function setupBarData(data, configuration) {
  const [x_key, y_key, type, x_axis_treat_as] = [
    configuration.x_axis.value,
    configuration.y_axis.value,
    configuration.type.value,
    configuration.x_axis.treat_as
  ];
  let bar_data = structureData(data, x_key, y_key, x_axis_treat_as);
  const calculationFun = calculations[type];
  bar_data.forEach(datum => {
    datum.y_value = calculationFun(datum.y_values);
    delete datum.y_values;
  });

  return bar_data;
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
  calculations,
  setupBarData,
  setupStackBarData
}

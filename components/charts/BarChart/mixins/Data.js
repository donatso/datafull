
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

function prepareData(data, configuration) {
  const [x_key, y_key, type, slice] = [configuration.x_axis.value, configuration.y_axis.value, configuration.type.value, configuration.slice]
  let bar_data = structureData(data);
  const calculationFun = calculations[type];
  bar_data.forEach(datum => {
    datum.value = calculationFun(datum.values)
    delete datum.values
  })

  bar_data = bar_data.sort((a,b) => b.value - a.value)

  if (slice) sliceToOther(slice)

  bar_data = bar_data.filter(d => configuration.excluded.indexOf(d.label) === -1)

  return bar_data

  function structureData(data) {
    let classified = classify(data, x_key)

    return Object.keys(classified)
      .map(k => ({
        label: k,
        values: classified[k].map(d => y_key ? (parseFloat(d[y_key]) || 0) : null)
      }))
  }

  function classify(data, key) {
    const classDict = {}
    data.forEach(d => {
      if (configuration.x_axis.treat_as.value === "list") strToList(d[key], configuration.x_axis.treat_as.input.value).forEach(cls => push(cls, d))
      else push(d[key], d)
    })
    function push(cls, value) {
      if (!classDict.hasOwnProperty(cls)) classDict[cls] = []
      classDict[cls].push(value)
    }
    return classDict
  }

  function toXKeyYValueObject(data, x_key, y_key) {
    const obj = {}
    data.forEach((datum, iter) => {
      const x_val = datum[x_key],
        y_val = y_key ? (datum[y_key] || 0) : null;
      if (!obj.hasOwnProperty(x_val)) obj[x_val] = [];
      obj[x_val].push(y_val)
    });

    return obj
  }

  function strToList(str, separator) {
    if (!str || !separator) return []
    return str.split(separator)
  }

  function sliceToOther(slice) {
    const other = {
      label: "other",
      value: bar_data.reduce(
        (previousValue, d, currentIndex) =>
          previousValue + (currentIndex < slice ? 0 : d.value),
        0
      )
    };
    bar_data = bar_data.slice(0, slice);
    if (other.value > 0) bar_data.push(other);
  }
}

export default {
  calculations,
  prepareData
}

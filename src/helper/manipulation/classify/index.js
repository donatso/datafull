const arrayOfValuesToValueCalculations = {
  count: function (values) {
    return values.length;
  },
  total: function (values) {
    return _.sum(values)
  },
  medium: function (values) {
    const non_null_values = values.filter(v => v !== null);
    return _.sum(non_null_values) / non_null_values.length;
  }
}

function classifyData3(classified, x_key, y_key) {
  const reduced_data = {}
  Object.keys(classified).forEach(cls => {
    reduced_data[cls] = classified[cls].map(d => ({x_key, y_key, "x_value": d[x_key], "y_value": d[y_key]}))
  })

  return reduced_data
}


function classifyData(data, key, treat_as) {
  let classified;
  if (Array.isArray(key)) classified = classifyWithMultiKey(data, key)
  else if (treat_as.value === "list") classified = classifyDataWithXaxisAsList()
  else classified = classify(data, key)
  return classified

  function classify(data, key) {
    const classDict = {}
    data.forEach(d => pushToObjectKey(classDict, d[key], d))
    return classDict
  }

  function pushToObjectKey(dct, k, v) {
    if (!dct.hasOwnProperty(k)) dct[k] = []
    dct[k].push(v)
  }

  function classifyWithMultiKey(data, keys) {
    const classDict = {}
    data.forEach(d => pushToObjectKey(classDict, keys.map(k => d[k]).join("\t"), d))  // todo: better separator?
    return classDict
  }

  function classifyDataWithXaxisAsList() {
    let classified = classify(data, key)
    return extendClassDict()

    function extendClassDict() {
      const extendedClassDict = {};
      for (let cls in classified) {
        if (!classified.hasOwnProperty(cls)) continue
        const class_list = strToList(cls, treat_as.separator);
        const values = classified[cls];
        values.forEach(v =>
          class_list.forEach(cls =>
            pushToObjectKey(extendedClassDict, cls, v)
          )
        )
      }
      return extendedClassDict

      function strToList(str, separator) {
        if (!str || !separator) return []
        return str.split(separator)
      }
    }
  }
}

function classifiedDatumsToValue(classified, value_key, calculation_type) {
  const calculationFun = arrayOfValuesToValueCalculations[calculation_type];
  for (let cls in classified) {
    if (!classified.hasOwnProperty(cls)) continue
    const datum_values = classified[cls].map(d => +d[value_key]).filter(v => !isNaN(v))  // TODO: check if it should be a number
    classified[cls] = calculationFun(datum_values)
  }
  return classified
}

function classifiedToXaxisYaxisStructureArray(obj, x_key, y_key) {
  return Object.keys(obj)
    .map(k => ({
      x_key,
      x_value: k,

      y_key,
      y_value: obj[k]
    }))
}

function group(data, ...class_getters) {
  return loop(data, 0)

  function loop(data, i) {
    if (!(i < class_getters.length)) return data
    const grouped = classify(data, class_getters[i])
    for (let k in grouped) {
      if (!grouped.hasOwnProperty(k)) continue
      grouped[k] = loop(grouped[k], i+1)
    }
    return grouped
  }

  function classify(data, classGetter) {
    const classDict = {}
    data.forEach(d => pushToObjectKey(classDict, classGetter(d), d))
    return classDict
  }

  function pushToObjectKey(dct, k, v) {
    if (!dct.hasOwnProperty(k)) dct[k] = []
    dct[k].push(v)
  }
}

export default {
  arrayOfValuesToValueCalculations,
  classifyData,
  classifyData3,
  classifiedDatumsToValue,
  classifiedToXaxisYaxisStructureArray,
  group
}

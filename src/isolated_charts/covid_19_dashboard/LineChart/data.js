const Data = {};
export default Data;

Data.setupTotalByDates = function(data) {
  const dates = getDates();
  const line_data = [];

  dates.forEach(date => {
    line_data.push({date: new Date(date), value: d3.sum(data, d => d[date])})
  })
  line_data.sort((a, b) => b.date - a.date)
  return {total: line_data}

  function getDates() {
    return Object.keys(data[0]).map(k => k).filter(k => new Date(k) > 0)
  }
}

function group(data, ...class_getters) {
  return loop(data, 0)

  function loop(data, i) {
    if (!(i < class_getters.length)) return data
    const grouped = classify(data, fromKeyToGetter(class_getters[i]))
    for (let k in grouped) {
      if (!grouped.hasOwnProperty(k)) continue
      grouped[k] = loop(grouped[k], i+1)
    }
    return grouped
  }

  function fromKeyToGetter(maybeKey) {
    if (typeof maybeKey === "string") return d => d[maybeKey]
    else return maybeKey
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

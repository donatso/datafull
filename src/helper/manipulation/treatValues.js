function treatValues(data, k, as, opt) {
  if (as === "date") {
    data = treatDate(data, k, opt.time_format)
  } else if (as === "number") {
    data = treatNumber(data, k)
  }
  return data
}

function treatDate(data, k, time_format, opt) {
  const timeParse = time_format ? d3.timeParse(time_format) : (t) => new Date(t)
  data.forEach(d => {
    d[k] = timeParse(d[k])
  })
  data = data.filter(d => d[k])
  return data
}

function treatNumber(data, k) {
  data.forEach(d => d[k] = +d[k])
  return data
}

function numifyObjectValuesIfNumber(datum) {
  for (let k in datum) {
    if (!datum.hasOwnProperty(k)) continue
    const n = parseFloat(datum[k])
    if (!isNaN(n) && (""+n).length === datum[k].length) datum[k] = n
  }
}

export default treatValues;
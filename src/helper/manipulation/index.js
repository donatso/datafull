import classify from "./classify.js"
import frequency from "./frequency.js"

export default {
  classify,
  frequency,

  numifyObjectValuesIfNumber,
  treatValues
}

function numifyObjectValuesIfNumber(datum) {
  for (let k in datum) {
    if (!datum.hasOwnProperty(k)) continue
    const n = parseFloat(datum[k])
    if (!isNaN(n) && (""+n).length === datum[k].length) datum[k] = n
  }
}

function treatValues(data, k, as, opt) {
  if (as === "date") {
    data.forEach(d => d[k] = new Date(d[k].split(".").reverse().join(".")))  // TODO: treat to date function
    data = data.filter(d => d.x_value.getTime() > 0)
  } else if (as === "number") {
    data.forEach(d => d[k] = +d[k])
  }
  return data
}

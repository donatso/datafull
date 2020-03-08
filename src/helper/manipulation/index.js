import classify from "./classify.js"

export default {
  classify,
  numifyObjectValuesIfNumber,
  createFrequencyData,
  treatValues
}

function numifyObjectValuesIfNumber(datum) {
  for (let k in datum) {
    if (!datum.hasOwnProperty(k)) continue
    const n = parseFloat(datum[k])
    if (!isNaN(n) && (""+n).length === datum[k].length) datum[k] = n
  }
}

function createFrequencyData(data, x_key, options) {
  options = _.defaultsDeep(options || {},{
    steps_count: 100
  });

  const freq_data = {},
    [min, max] = d3.extent(data, d => +d[x_key]),
    scale_step = (max - min) / options.steps_count;

  for (let i = 1; i < options.steps_count + 1; i++) {
    let step_span = [
        min + scale_step * (i - 1) - scale_step / 2,
        min + scale_step * i - scale_step / 2
      ],
      step_middle = step_span[0] + (step_span[1] - step_span[0]) / 2,
      value = 0;

    data.forEach(d => {if (step_span[0] < +d[x_key] && step_span[1] > +d[x_key]) value++;})

    freq_data[step_middle] = value;
  }

  return freq_data
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

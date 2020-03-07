import classify from "./classify.js"

export default {
  classify,
  numifyObjectValuesIfNumber,
  createFrequencyData
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

  const freq_data = [],
    [min, max] = d3.extent(data, d => d[x_key]),
    time_step = (max - min) / options.steps_count;

  for (let i = 1; i < options.steps_count + 1; i++) {
    const time_span = [
      min + time_step * (i - 1) - time_step / 2,
      min + time_step * i - time_step / 2
    ];
    let value = 0;
    for (let j = 0; j < data.length; j++) {
      const d = data[j];
      if (time_span[0] < d[x_key] && time_span[1] > d[x_key]) value++;
    }
    freq_data.push({
      x_key,
      y_key: "frequency",
      x_value: time_span[0] + (time_span[1] - time_span[0]) / 2,
      y_value: value
    });
  }

  return freq_data;
}
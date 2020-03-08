function createFrequencyData(data, x_key, options) {
  options = _.defaultsDeep(options || {},{
    steps_count: 100
  });

  const freq_data = {},
    [min, max] = d3.extent(data, d => +d[x_key]),
    scale_step = (max - min) / options.steps_count;

  freq_data[min] = .5
  freq_data[max] = .5

  for (let i = 0; i < options.steps_count; i++) {
    let step_span = [
        min + (scale_step * i),
        min + scale_step * (i+1)
      ],
      step_middle = step_span[0] + scale_step/2,
      value = 0;
    const [s, e] = step_span;
    data.forEach(d => {
      const v = +d[x_key];
      if ((s < v && e > v)) value++;
      if (s === v || e === v) value += .5
    })
    freq_data[step_middle] = value;
  }

  return freq_data
}

export default {
  createFrequencyData
}

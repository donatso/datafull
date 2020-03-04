function createFrequencyData(data, scale_key, options) {
  options = _.defaultsDeep(options || {},{
    steps_count: 100
  });

  const freq_data = [],
    [min, max] = d3.extent(data, d => d[scale_key]),
    time_step = (max - min) / options.steps_count;

  for (let i = 1; i < options.steps_count + 1; i++) {
    const time_span = [
      min + time_step * (i - 1) - time_step / 2,
      min + time_step * i - time_step / 2
    ];
    let value = 0;
    for (let j = 0; j < data.length; j++) {
      const d = data[j];
      if (time_span[0] < d[scale_key] && time_span[1] > d[scale_key]) value++;
    }
    freq_data.push({
      x_value: time_span[0] + (time_span[1] - time_span[0]) / 2,
      y_value: value
    });
  }

  return freq_data;
}

export default {
  createFrequencyData
}

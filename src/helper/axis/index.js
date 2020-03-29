function setupScales(data, axis_config, axis_key, range) {
  const scale_type = getScale(axis_config.type),
    scale_domain = getScaleDomain(scale_type)

  return d3[scale_type]()
    .range(range)
    .domain(scale_domain);

  function getScale(type) {
    if (type === 'string') return "scaleBand"
    else if (type === 'number') return "scaleLinear"
    else if (type === 'date') return "scaleTime"
    else if (type === 'list') return "scaleBand"
  }

  function getScaleDomain(scale_type) {
    if (scale_type === 'scaleBand') return data.map(d => d[axis_key])
    else if (scale_type === 'scaleLinear') return [0, d3.max(data, d => d[axis_key])]
    else if (scale_type === 'scaleTime') return d3.extent(data, d => d[axis_key])
  }
}

export default {
  setupScales
}
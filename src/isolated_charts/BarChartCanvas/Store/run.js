const Run = {}
export default Run;
Run.start = function() {
}

Run.run = function(data, animation_time, updateF) {
  const [start_date, end_date] = getTimespan(data),
    timeScale = d3.scaleLinear().domain([0,animation_time]).range([start_date, end_date]);

  const timer = d3.timer(t => {
    if (t > 10000) timer.stop()
    let t_date = timeScale(t),
      nodes = []
    for (let k in data) {
      if (!data.hasOwnProperty(k)) continue
      const value = Run.getProgressValue(data[k], t_date)
      nodes.push({name:k, value})
    }
    nodes.sort((a,b) => b.value - a.value)
    nodes = nodes.slice(0,20)
    updateF(nodes)
  })

}

Run.getProgressValue = function (data, t_date) {
  let value = null,
    bisect = d3.bisector(d => d._date),
    i = bisect.left(data, t_date);

  if (i > 0 && i < data.length) {
    const datum_left = data[i-1], datum_right = data[i]
    const progress_to_right = (t_date - datum_left._date) / (datum_right._date - datum_left._date)
    value = datum_left._value + (datum_right._value - datum_left._value) * progress_to_right
  }
  return value
}


function getTimespan(data) {
  const flatten = []
  for (let k in data) {
    if (!data.hasOwnProperty(k)) continue
    flatten.push(...data[k])
  }
  return d3.extent(flatten, d => d._date)
}


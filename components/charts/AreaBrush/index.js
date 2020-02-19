export default function AreaBrush() {
}

AreaBrush.create = function(cont){
  const svg = cont.append("svg"),
    main_g = svg.append("g").attr("class", "main_g");

  main_g.append("path").attr("class", "area");
  main_g.append("g").attr("class", "axis axis--x");
  main_g.append("g").attr("class", "brush");
}

AreaBrush.setupDims = function (cont) {
  const rect = cont.node().getBoundingClientRect();
  const dim = {
    width: rect.width,
    height: rect.height,
    mt: 25,
    mr: 15,
    mb: 25,
    ml: 15
  };
  dim.inner_width = dim.width - dim.ml - dim.mr;
  dim.inner_height = dim.height - dim.mt - dim.mb;

  return dim
}

AreaBrush.updateElements = function (cont, dim) {
  const svg = cont.select("svg"),
    main_g = svg.select("g.main_g")

  svg.attr("width", dim.width).attr("height", dim.height);

  main_g.attr(
    "transform",
    "translate(" + dim.ml + "," + dim.mt + ")"
  );

  main_g
    .select("path.area")
    .style("fill", "grey")
    .style("stroke-width", 1)
    .style("stroke", "grey");

  main_g
    .select("g.axis.axis--x")
    .attr("transform", "translate(0," + dim.inner_height + ")");
}

AreaBrush.draw = function (data, cont, dim, scaleChange) {
  const svg = cont.select("svg"),
    main_g = svg.select("g.main_g"),
    brush = d3.brushX(),
    d3x = d3.scaleLinear(),
    d3y = d3.scaleLinear(),
    xAxis = d3.axisBottom(d3x),
    area = d3.area();

  console.log(data)

  brush
    .extent([[0, 0], [dim.inner_width, dim.inner_height]])
    .on("brush end", AreaBrush.brushed(d3x, scaleChange))

  d3x
    .range([0, dim.inner_width])
    .domain(d3.extent(data, d => d.x_value));
  d3y
    .range([dim.inner_height, 0])
    .domain([0, d3.max(data, d => d.y_value)]);

  area
    .curve(d3.curveMonotoneX)
    .x(function (d) {
      return d3x(d.x_value);
    })
    .y0(dim.inner_height)
    .y1(function (d) {
      return d3y(d.y_value);
    });

  main_g.select("g.brush").call(brush);

  main_g
    .select("path.area")
    .datum(data)
    .attr("d", area);

  main_g.select("g.axis.axis--x").call(xAxis);
}

AreaBrush.createFrequencyData = function (data, scale_key, options) {
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

AreaBrush.brushed = function(d3x, scaleChange) {

  return function () {
    if (!d3.event.sourceEvent) return;
    const s = d3.event.selection,
      domain = s.map(d3x.invert, d3x);
    scaleChange(domain)
  }

}

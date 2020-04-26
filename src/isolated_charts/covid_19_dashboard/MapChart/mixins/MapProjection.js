function setup({projection_type}) {
  const d3_projection = projection_type ? d3[projection_type]() : d3.geoMercator();
  d3_projection.scale(1).translate([0, 0]);
  return d3_projection
}

function posToCoor(d3_projection, pos) {
  return d3_projection.invert(pos)
}

function parcelCenter(d3_projection, geometries, dim, zoomable_node) {
  const geoPath = d3.geoPath().projection(d3_projection);

  function getGroupBounds(geometries) {
    const group_bounds = [[], []]
    const arrMin = (s, t, n1, n2) => {
      t[n1][n2] = Math.min(t[n1][n2] || Infinity, s[n1][n2])
    }
    const arrMax = (s, t, n1, n2) => {
      t[n1][n2] = Math.max(t[n1][n2] || -Infinity, s[n1][n2])
    }
    for (let i = 0; i < geometries.length; i++) {
      const geom = geometries[i];
      const bounds = geoPath.bounds(geom);
      arrMin(bounds, group_bounds, 0, 0)
      arrMin(bounds, group_bounds, 0, 1)
      arrMax(bounds, group_bounds, 1, 0)
      arrMax(bounds, group_bounds, 1, 1)
    }
    return group_bounds
  }
  // get bounds of parcels on the map
  let bounds = getGroupBounds(geometries),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    k = .9 / Math.max(dx / dim.width, dy / dim.height);



  // put bound area to center
  const last_t = d3.zoomTransform(zoomable_node);
  const max_scale = 6000000 / last_t.k
  k = Math.min(k, max_scale);
  x = -(x - (dim.width / 2) / k) * k
  y = -(y - (dim.height / 2) / k) * k

  // add calculated zoom to current zoom
  const t = {};
  t.k = last_t.k * k;
  t.x = last_t.x * k + x;
  t.y = last_t.y * k + y;
  return t
}

function geojsonCenter(d3_projection, geojson, dim, scale) {
  const geoPath = d3.geoPath().projection(d3_projection);

  let b = geoPath.bounds(geojson),
    k = scale / Math.max((b[1][0] - b[0][0]) / dim.width, (b[1][1] - b[0][1]) / dim.height),
    [x,y] = [(dim.width - k * (b[1][0] + b[0][0])) / 2, (dim.height - k * (b[1][1] + b[0][1])) / 2];

  return {x,y,k}
}

function zoomToParcels({data, zoomable_node, d3_projection, d3_zoom, dim, key__geom, opt}) {
  const geometries = data.map(d => d[key__geom]).filter(d => d)
  if (geometries.length === 0) return
  const t = parcelCenter(d3_projection, geometries, dim, zoomable_node)
  manualZoom(t, opt.duration, opt.delay)

  function manualZoom(t, duration, delay) {
    const map_t = d3.zoomIdentity.translate(t.x, t.y).scale(t.k);
    d3.select(zoomable_node).transition().duration(duration || 0).delay(delay || 0)
      .call(d3_zoom.transform, map_t);
  }
}

function setupLazyZoom(chart, onZoom, d3_zoom, {timeout, onMove}) {

  let last_t = {x: 0, y: 0, k: 0},
    zoomed_timeout = setTimeout(() => {}, 1),
    wrapper = d3.select(chart.node().parentNode)

  chart.style("transform-origin", "0% 0%")

  d3_zoom.on("zoom", zoomed);
  wrapper.call(d3_zoom);

  const croZoom = {k: 8013, x: -1852, y: 7413};
  manualZoom(croZoom)

  function zoomed() {
    if (onMove) onMove()
    const t = d3.event.transform;

    {
      let k = t.k / last_t.k;
      let x = t.x - last_t.x * k;
      let y = t.y - last_t.y * k;

      chart.style("transform", "translate(" + x + "px," + y + "px)scale(" + k + ")")
    }

    clearTimeout(zoomed_timeout)
    zoomed_timeout = setTimeout(() => {
      onZoom(t)
      chart.style("transform", null);
      last_t = t;
    }, timeout)

  }

  function manualZoom(t, duration, delay) {

    const map_t = d3.zoomIdentity
      .translate(t.x, t.y)
      .scale(t.k);

    wrapper
      .transition()
      .duration(duration || 0)
      .delay(delay || 0)
      .call(d3_zoom.transform, map_t);
  }
}

function updateProjection(d3_projection, t) {
  d3_projection.scale(t.k).translate([t.x, t.y]);  // it setting!! :/
}

export default {
  setup,
  posToCoor,
  setupLazyZoom,
  updateProjection,
  zoomToParcels,
  geojsonCenter
}


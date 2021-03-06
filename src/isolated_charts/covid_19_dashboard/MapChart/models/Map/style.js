const Style = {};
export default Style;

Style.setupDims = function ({width, height}) {
  const dim = {
    width,
    height
  }
  return dim
}

Style.setupStyle = function(heatmap) {
  Style.world_map_bg.fillF = d => {
    return heatmap.hasOwnProperty(d.properties.name) ? d3.interpolateReds(heatmap[d.properties.name]) : "grey"
  }
}

Style.world_map_bg = {
  "stroke-width": 1,
  fill: "grey",
  color: "black"
}

Style.points = {
  fill: "red",
  r: 4
}

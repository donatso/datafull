const Style = {};
export default Style;

Style.setupDims = function ({width, height}) {
  const dim = {
    width,
    height
  }
  return dim
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

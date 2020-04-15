const style = {};
export default style;

style.setupColors = function() {

  const color = [
      "#FFC000",
      "#9966CC",
      "#007FFF",
      "#0000FF",
      "#0095B6",
      "#964B00",
      "#800020",
      "#B87333",
      "#008000",
      "#50C878",
      "#00A86B",
      "#000080",
      "#FF6600",
      "#FF4500",
      "#003153",
      "#FF0000",
      "#7F00FF",
      "#808080",
      "#009000",
      "#32B141",
    ]

  return d3.scaleOrdinal().range(color)
}

style.calculateDims = function({width, height}) {
  const dim = {
    width,
    height,
    rect: {
      x_offset: 150,
      y_offset: 150,
      width: width - 150 - 200
    }
  }

  return dim
}

style.resolutions = {
  SD: {width: 640, height: 480},
  HD: {width: 1280, height: 720},
  FHD: {width: 1920, height: 1080},
  UHD: {width: 3840, height: 2160},
}

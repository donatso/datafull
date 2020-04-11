const style = {};
export default style;

style.setupColors = function() {

  const color =
    [
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
    svg: {width, height},
    main_group: {},
    margin: {
      top: 120,
      right: 150,
      bottom: 60,
      left: 25
    },
    node: {
      pic: {width: 0},
      bar: {width: 0},
      value_label: {width: 130}
    },
    is_mobile: window.innerWidth < 600,
  }

  dim.main_group.width = dim.svg.width - dim.margin.left - dim.margin.right;
  dim.main_group.height = dim.svg.height - dim.margin.top - dim.margin.bottom;

  dim.node.pic.width = 150;

  dim.node.bar.width = dim.main_group.width - dim.node.pic.width - dim.node.value_label.width;

  return dim
}
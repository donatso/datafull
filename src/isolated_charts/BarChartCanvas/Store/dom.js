const dom = {};
export default dom;

dom.setupCanvas = function (dim) {
  const canvas = document.querySelector("canvas")
  canvas.setAttribute("width", dim.width);
  canvas.setAttribute("height", dim.height);
  return [canvas, canvas.getContext("2d")]
}

dom.setupResponsiveCanvas = function() {
  const self = this;
  window.addEventListener("resize", resize)
  resize()
  function resize() {
    console.log("resize")
    const canvas = self.canvas,
      dim = self.dim,
      parent_width = canvas.parentNode.getBoundingClientRect().width-20,
      ratio = parent_width / dim.width
    canvas.style.transformOrigin = "0 0"
    canvas.style.transform = "scale(" + ratio + ")"
    return dim
  }
}



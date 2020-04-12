const dom = {};
export default dom;

dom.setupCanvas = function (dim) {
  const canvas = document.querySelector("canvas")
  canvas.setAttribute("width", dim.width);
  canvas.setAttribute("height", dim.height);
  return [canvas, canvas.getContext("2d")]
}




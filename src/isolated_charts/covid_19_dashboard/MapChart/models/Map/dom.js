const Dom = {};
export default Dom;

Dom.setupCanvas = function (cont, dim) {
  const canvas = cont.appendChild(document.createElement("canvas")),
    ctx = canvas.getContext("2d")
  canvas.setAttribute("width", dim.width)
  canvas.setAttribute("height", dim.height)
  return [canvas, ctx]
}
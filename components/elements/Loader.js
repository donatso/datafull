export default function ()  {
  const cont = d3.select("body").append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("top", "0")
    .style("left", "0")
    .style("width", "100vw")
    .style("height", "100vh")
    .style("height", "100vh")
    .style("background-color", "rgba(0,0,0,.3)")
    .style("text-align", "center")

  const text = cont.append("h1")
    .style("padding", "30%")

  text.html("LOADING...")

  function onProgressChange(progress_text) {
    text.html(progress_text)
  }

  function destroy() {
    cont.remove()
  }

  return {cont, text, onProgressChange, destroy}
}
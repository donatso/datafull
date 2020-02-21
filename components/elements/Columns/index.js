import helper from "../../../helper/index.js"

export default function Columns(cont, options, store) {
  const self = this;

  self.root_cont = d3.select(cont);
  self.options = options;
  self.style = self.options.style;
  self.store = store;

  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.style.dim, self.resize.bind(self));
    else return self.root_cont.style("height", "100%").append("div").style("height", "100%")
  })();

  self.setupEventListeners();
}

Columns.prototype.resize = function () {}

Columns.prototype.setupEventListeners = function() {
  const self = this;
  self.store.event.on("data_change", self.initialize.bind(self))
}

Columns.prototype.initialize = function () {
  const self = this;
  self.create();
}

Columns.prototype.create = function() {
  const self = this;

  self.main_cont.html("")

  const columns = self.store.data.datum_keys;
  const cont = self.main_cont.append("div");

  columns.forEach(col => {
    const node = cont.append("div").attr("class", "item")
    node.append("span").html(col)
    const options_node = node.append("div").attr("class", "options")
    options_node.append("span").attr("class", "filter").html(Columns.getIcon("filter"))
    options_node.append("span").attr("class", "settings").html(Columns.getIcon("settings"))

    node.on("mouseenter", () => node.style("background-color", "lightgrey"))
    node.on("mouseleave", () => {

      node.style("background-color", null)
    })
    node.on("click", () => {
      console.log(col)
    })
  })

  Columns.stylize1(cont)
}


Columns.stylize1 = function(cont) {
  cont
    .style("height", "100%")
    .style("overflow", "auto")

  cont.selectAll(".item")
    .style("border", "solid lightgrey 1px")
    .style("text-align", "center")
    .style("padding", "5px 0")
    .style("position", "relative")

  cont.selectAll(".options")
    .style("position", "absolute")
    .style("top", "2px")
    .style("right", "2px")

  cont.selectAll(".options svg")
    .style("width", "16px")



}


Columns.getIcon = function(name) {
  if (name === "filter") {
    return `
      <svg viewBox="0 0 971.986 971.986" style="enable-background:new 0 0 971.986 971.986;">
        <path style="stroke: black; stroke-width: 90; fill: none;" d="M370.216,459.3c10.2,11.1,15.8,25.6,15.8,40.6v442c0,26.601,32.1,40.101,51.1,21.4l123.3-141.3
           c16.5-19.8,25.6-29.601,25.6-49.2V500c0-15,5.7-29.5,15.8-40.601L955.615,75.5c26.5-28.8,6.101-75.5-33.1-75.5h-873 
             c-39.2,0-59.7,46.6-33.1,75.5L370.216,459.3z"/>
       </svg>`
  } else if (name === "settings") {
    return `
    <svg viewBox="0 0 340.274 340.274" style="enable-background:new 0 0 340.274 340.274;">
        <path style="stroke: black; stroke-width: 30; fill: none;" d="M293.629,127.806l-5.795-13.739c19.846-44.856,18.53-46.189,14.676-50.08l-25.353-24.77l-2.516-2.12h-2.937
             c-1.549,0-6.173,0-44.712,17.48l-14.184-5.719c-18.332-45.444-20.212-45.444-25.58-45.444h-35.765 
             c-5.362,0-7.446-0.006-24.448,45.606l-14.123,5.734C86.848,43.757,71.574,38.19,67.452,38.19l-3.381,0.105L36.801,65.032
             c-4.138,3.891-5.582,5.263,15.402,49.425l-5.774,13.691C0,146.097,0,147.838,0,153.33v35.068c0,5.501,0,7.44,46.585,24.127     
             l5.773,13.667c-19.843,44.832-18.51,46.178-14.655,50.032l25.353,24.8l2.522,2.168h2.951c1.525,0,6.092,0,44.685-17.516     
             l14.159,5.758c18.335,45.438,20.218,45.427,25.598,45.427h35.771c5.47,0,7.41,0,24.463-45.589l14.195-5.74     
             c26.014,11,41.253,16.585,45.349,16.585l3.404-0.096l27.479-26.901c3.909-3.945,5.278-5.309-15.589-49.288l5.734-13.702     
             c46.496-17.967,46.496-19.853,46.496-25.221v-35.029C340.268,146.361,340.268,144.434,293.629,127.806z M170.128,228.474
            c-32.798,0-59.504-26.187-59.504-58.364c0-32.153,26.707-58.315,59.504-58.315c32.78,0,59.43,26.168,59.43,58.315     
            C229.552,202.287,202.902,228.474,170.128,228.474z"/>
    </svg>`
  }
}



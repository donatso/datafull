import Loader from "../elements/Loader.js"
import Modal from "./Modal.js"
import helper from "../../helper/index.js"

export default function FreeList(cont, options, store) {
  const self = this;

  self.root_cont = d3.select(cont);
  self.options = options;
  self.style = self.options.style;
  self.store = store;

  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.style.dim, self.resize.bind(self));
    else return self.root_cont.style("height", "100%").append("div").style("height", "100%")
  })();
}

FreeList.prototype.resize = function () {
}

FreeList.prototype.createDashboard = function (config) {
  const self = this;

  if (!config) return

  const options = Object.keys(config);

  self.dash = {
    options: options,
    active: this.options[0]
  }

  self.elements.select.on("change", changed)

  for (let i = 0; i < self.dash.options.length; i++) {
    const key = options[i]
    self.elements.select.append("option").attr("value", key).html(key)
  }

  function changed() {
    self.dash.active = self.elements.select.node().value;
    const d = config[self.dash.active]
    d.create(self.elements.options_cont)
    self.elements.fetch_button.on("click", () => self.fetchQuery(d.get))
  }

  function initial() {
    changed()
  }

  initial()
}

FreeList.prototype.initialize = function () {
  const self = this;

  self.elements = {
    query_name_input: self.main_cont.append("input").attr("class", "query_name").attr("placeholder", "query_name"),
    select: self.main_cont.append("select"),
    options_cont: self.main_cont.append("div"),
    textarea: self.main_cont.append("textarea"),
    fetch_button: self.main_cont.append("button")
  }

  function stylize() {

    self.elements.query_name_input
      .style("width", "100%")
      .style("margin-bottom", "5px")

    self.elements.select
      .style("width", "100%")
      .style("margin-bottom", "5px")

    self.elements.options_cont
      .style("width", "100%")
      .style("height", "40px")

    self.elements.textarea
      .style("width", "100%")
      .style("height", "80%")

    self.elements.fetch_button
      .style("position", "absolute")
      .style("left", "0")
      .style("bottom", "0")
      .style("width", "100%")
      .style("height", "20px")
      .html("FETCH")
  }

  stylize();
  self.createDashboard(self.options.dash_config)
}

FreeList.prototype.setQuery = function (query) {
  const self = this;
  self.elements.textarea.node().value = query
}

FreeList.prototype.getQuery = function () {
  const self = this;
  return self.elements.textarea.node().value
}

FreeList.prototype.fetchQuery = function (getDispatch) {
  const self = this;

  const text_area_value = self.getTextAreaValue();
  const query_name = self.getQueryName();
  if (!query_name) {
    Modal.createWithHtml("please put query name");
    return
  }

  const loader = Loader()

  getDispatch(query_name, text_area_value, loader)
    .finally(() => loader.cont.remove())

}

FreeList.prototype.getQueryName = function () {
  const self = this;
  return self.main_cont.select("input.query_name").node().value
}

FreeList.prototype.getTextAreaValue = function () {
  const self = this;
  return self.main_cont.select("textarea").node().value
}


import Loader from "../elements/Loader.js"
import Modal from "./Modal.js"
import helper from "../../helper/index.js"

export default class {
  constructor(cont, options, store) {

    const CI = this;

    CI.root_cont = d3.select(cont);
    CI.options = options;
    CI.style = CI.options.style;
    CI.store = store;

    CI.main_cont = (() => {
      if (CI.options.resizable) return helper.style.Resizable(CI.root_cont, CI.style.dim, CI.resize.bind(CI));
      else return CI.root_cont.style("height", "100%").append("div").style("height", "100%")
    })();
  }

  resize() {}

  createDashboard(config) {
    const CI = this;

    if (!config) return

    const options = Object.keys(config);

    CI.dash = {
      options: options,
      active: this.options[0]
    }

    CI.elements.select.on("change", changed)

    for (let i = 0; i < CI.dash.options.length; i++) {
      const key = options[i]
      CI.elements.select.append("option").attr("value", key).html(key)
    }

    function changed() {
      CI.dash.active = CI.elements.select.node().value;
      const d = config[CI.dash.active]
      d.create(CI.elements.options_cont)
      CI.elements.fetch_button.on("click", () => CI.fetchQuery(d.get))
    }

    function initial() {
      changed()
    }

    initial()
  }

  initialize() {
    const CI = this;

    CI.elements = {
      query_name_input: CI.main_cont.append("input").attr("class", "query_name").attr("placeholder", "query_name"),
      select: CI.main_cont.append("select"),
      options_cont: CI.main_cont.append("div"),
      textarea: CI.main_cont.append("textarea"),
      fetch_button: CI.main_cont.append("button")
    }

    function stylize() {

      CI.elements.query_name_input
        .style("width", "100%")
        .style("margin-bottom", "5px")

      CI.elements.select
        .style("width", "100%")
        .style("margin-bottom", "5px")

      CI.elements.options_cont
        .style("width", "100%")
        .style("height", "40px")

      CI.elements.textarea
        .style("width", "100%")
        .style("height", "80%")

      CI.elements.fetch_button
        .style("position", "absolute")
        .style("left", "0")
        .style("bottom", "0")
        .style("width", "100%")
        .style("height", "20px")
        .html("FETCH")
    }
    stylize();
    CI.createDashboard(CI.options.dash_config)
  }

  setQuery(query) {
    const CI = this;
    CI.elements.textarea.node().value = query
  }

  getQuery() {
    const CI = this;
    return CI.elements.textarea.node().value
  }

  fetchQuery(getDispatch) {
    const CI = this;

    const text_area_value = CI.getTextAreaValue();
    const query_name = CI.getQueryName();
    if (!query_name) {Modal.createWithHtml("please put query name");return}

    const loader = Loader()

    getDispatch(query_name, text_area_value, loader)
      .finally(() => loader.cont.remove())

  }

  getQueryName() {
    const CI = this;
    return CI.main_cont.select("input.query_name").node().value
  }

  getTextAreaValue() {
    const CI = this;
    return CI.main_cont.select("textarea").node().value
  }

}
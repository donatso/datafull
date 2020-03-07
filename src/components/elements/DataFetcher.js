import Loader from "../elements/Loader.js"
import Modal from "./Modal.js"
import helper from "../../helper/index.js"

export default function DataFetcher(cont, options, store) {
  const self = this;

  self.root_cont = d3.select(cont);
  self.options = options;
  self.style = self.options.style;
  self.store = store;

  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.style.dim, self.resize.bind(self));
    else return self.root_cont.style("height", "100%").append("div").style("height", "100%")
  })();

  self.create()
}

DataFetcher.prototype.resize = function () {
}

DataFetcher.prototype.create = function() {
  const self = this;

  self.createOptionsCont(self.main_cont.append("div").attr("class", "options_cont"))

  self.main_cont.append("textarea")
    .attr("placeholder", "input url or copy/paste your json/csv data")

  self.main_cont.append("button")
    .attr("class", "fetch")
    .on("click", () => self.fetchQuery())
    .html("FETCH")

  DataFetcher.stylize1(self.main_cont)
}

DataFetcher.prototype.createOptionsCont = function(cont) {
  const self = this;

  cont.append("span").html("autofill: ")
  self.options.autofills.forEach(d => {
    cont.append("button")
      .on("click", function () {
        self.setQuery(d.value)
      })
      .html(d.label)
  })
}

DataFetcher.prototype.setQuery = function (query) {
  const self = this;
  self.main_cont.select("textarea").node().value = query
}

DataFetcher.prototype.getQuery = function () {
  const self = this;
  return self.main_cont.select("textarea").node().value
}

DataFetcher.prototype.fetchQuery = async function () {
  const self = this;

  const loader = Loader()
  const query_text = self.getQuery();
  let data_string, data;
  if (DataFetcher.isTextUrl(query_text)) data_string = await fetch(query_text).then(resp => resp.text())
  else data_string = query_text;

  if (DataFetcher.isTextJson(data_string)) data = JSON.parse(data_string);
  else if (DataFetcher.isTextCsv(data_string)) data = d3.csvParse(data_string)
  loader.destroy()
  if (self.options.dataChange) self.options.dataChange(data)
  else self.dataChange(data)
}

DataFetcher.prototype.dataChange = function(data) {
  const self = this;

  self.store.data.insert(data, null)
  self.store.event.trigger("data_change")
  self.store.event.trigger("all")
}


DataFetcher.isTextUrl = function(text) {
  return text.slice(0,4) === "http"
}

DataFetcher.isTextJson = function(text) {
  return (text.slice(0,1) === "{") || (text.slice(0,1) === "[")
}

DataFetcher.isTextCsv = function(text) {
  const rows = text.split("\n")
  return rows.length > 1
}

DataFetcher.stylize1 = function(cont) {

  cont
    .style("display", "flex")
    .style("flex-direction", "column")

  cont.select("div.options_cont")

  cont.select("textarea")
    .style("width", "100%")
    .style("flex-grow", "1")

  cont.select("button.fetch")
    .style("width", "100%")
    .style("height", "30px")
}


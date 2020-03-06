import Nav from "./Nav.js"
import ColorPicker from "./ColorPicker.js"
import Modal from "./Modal.js"
import helper from "../../helper/index.js"


export default function Table(cont, options, store) {
  const self = this;

  self.root_cont = d3.select(cont)
  self.options = options;
  self.style = self.options.style;
  self.store = store;
  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.style.dim, self.resize.bind(self));
    else return self.root_cont.style("height", "100%").append("div").style("height", "100%")
  })();

  self.setupEventListeners();

  self.options.table_display = "all"
  self.list_num_maximum = 50;
  self.list_index = 0;

  self.options.keys_out = self.options.keys_out ? [...self.options.keys_out, "__d"] : ["__d"]

  self.initialize();
}

Table.prototype.resize = function () {};

Table.prototype.setupEventListeners = function () {
  const self = this;

  self.store.event.on("all", self.updateTable.bind(self))
  self.store.event.on("data_change", self.initialize.bind(self))
  self.store.event.on("active_change", self.activeChanged.bind(self))
}

Table.prototype.initialize = function () {
  const self = this;

  self.main_cont.html("")
  self.createDash();
  self.tabs[0].setActive()

}

Table.prototype.filterData = function () {
  const self = this;
  const data = self.data = self.store.data.active_data,
    disp = self.options.table_display;
  if (disp === "all") self.data = self.data;
  else if (disp === "selected") self.data = data.filter(d => d.__d.selected)
  else self.data = data.filter(d => d.__d.type === disp)

}

Table.prototype.changeTab = function (tab) {
  const self = this;

  self.main_cont.select(".config").style("display", ["all", "selected"].indexOf(tab.label) !== -1 ? "none" : "block")

  self.options.table_display = tab.label;
  self.updateTable()
}

Table.prototype.updateTable = function () {
  const self = this;

  self.filterData();

  self.updateListNum();
  self.drawTable();
}

Table.prototype.createDash = function () {
  const self = this;
  const nav = new Nav(self.main_cont, {onTabChange: d => self.changeTab(d)})

  nav.elements.nav.append("div").attr("class", "list_nav_cont")
  nav.elements.nav.append("div").attr("class", "config")
  nav.elements.view.append("div").attr("class", "table")

  const colorPicker = new ColorPicker(self.main_cont.select(".config").append("div").node())
  colorPicker.initialize().then(() => {
    colorPicker.wiget.on('color:change', function (color, changes) {
      self.store.style.changeElementColor(self.options.table_display, color.rgbaString)
      self.store.event.trigger("all")
    });
  })

  self.main_cont.select(".config")
    .style("width", "100%")
    .style("order", "1")

  self.main_cont.select(".config").append("button").on("click", () => colorPicker.show()).html("color")
  self.main_cont.select(".config").append("button").on("click", () => {
    Modal.createAreYouSure().then(answer => {
      if (answer === true) {
        self.store.data.remove(self.options.table_display)
        self.store.event.trigger("data_change")
        self.store.event.trigger("all")
      }
    })
  }).html("remove")


  self.main_cont.select(".list_nav_cont").style("padding", "1px").style("width", "100%")
    .style("text-align", "center").style("order", "2")

  self.main_cont.select(".table")
    .style("width", "100%")
    .style("height", "100%")
    .style("overflow-y", "auto");

  self.tabs = [
    "all",
    "selected",
    ...[...new Set(self.store.data.active_data.map(d => d.__d.type))]
  ].map(label => ({label})).map(d => nav.addElement(d))
}

Table.prototype.updateListNum = function () {
  const self = this;

  function listIndexChange(arrow) {
    if (arrow === "<") self.list_index -= self.list_num_maximum
    else if (arrow === ">") self.list_index += self.list_num_maximum
    if (self.list_index < 0) self.list_index = 0
    if (self.list_index > self.data.length - 2) self.list_index = self.data.length - 2
    self.store.event.trigger({})
  }

  function setupListNum() {
    num_cont.select(".list_num").html((self.list_index + 1) + "-" + Math.min(self.list_index + self.list_num_maximum, self.data.length))
  }

  const num_cont = self.main_cont.select(".list_nav_cont")
  num_cont.html("")

  num_cont.append("span").style("cursor", "pointer").on("click", () => listIndexChange("<")).html("< ")
  num_cont.append("span").attr("class", "list_num")
  num_cont.append("span").style("cursor", "pointer").on("click", () => listIndexChange(">")).html(" >")
  setupListNum()

}

Table.prototype.drawTable = function () {
  const self = this;

  const table = self.main_cont.select(".table")
  table.html("")

  const data = self.data.slice(self.list_index, self.list_index + self.list_num_maximum)

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const cont = table.append("div").attr("class", "row");
    self.updateRow(d, self.list_index + i + 1, cont)
  }

}

Table.prototype.updateRow = function (d, index, cont) {
  const self = this;

  const
    type = d.__d.type,
    style = self.store.style.get(type),
    color = style.color;

  cont.html("");
  cont
    .datum(d)
    .style("position", "relative")
    .style("padding", "20px 10px 10px")
    .style("margin-bottom", "5px")
    .style("background-color", color)
    .style("border", "solid 5px")

  cont.append("div")
    .style("position", "absolute")
    .style("top", "3px")
    .style("right", "10px")
    .html(index + "/" + self.data.length)

  Object.keys(d).forEach(k => {
    if (self.options.keys_out ? self.options.keys_out.indexOf(k) !== -1 : false) return

    const point = cont.append("div")
    point.append("span").style("font-variant", "small-caps").html(k + ": ")
    point.append("span").html(d[k])
  })

  if (self.options.hasOwnProperty("customRowStyle")) self.options.customRowStyle(d, cont)

  if (self.options.row_configs) {
    const config_cont = cont.append("div")
      .style("position", "absolute")
      .style("top", "1px")
      .style("left", "10px")

    config_cont.node().addEventListener("click", function (ev) {ev.stopPropagation()})  // to stop click event on row

    Table.addElements(config_cont, d, self.options.row_configs)
  }

  if (self.options.rowOnClick) cont.on("click", () =>  self.options.rowOnClick(d))

}

Table.prototype.activeChanged = function () {
  const self = this;

  self.filterData();

  const table = self.main_cont.select(".table"),
    rows = table.selectAll(".row"),
    rows_cnt = rows.size()

  if (rows_cnt < self.list_num_maximum && self.data.length !== rows_cnt) self.updateTable();
  else rows.each(function (d, i) {
    if (self.options.hasOwnProperty("customRowStyle")) self.options.customRowStyle(d, d3.select(this))
  })
}

Table.addElements = function(cont, datum, elements, options) {

  elements.forEach(element => {
    cont.append("span")
      .style("display", "inline-block")
      .style("cursor", "pointer")
      .style("background-color", "white")
      .style("font-size", "14px")
      .style("margin-left", "1px")
      .style("padding", "1px 5px")
      .on("click", () => element.onClick(datum))
      .html(element.label)
  })
}





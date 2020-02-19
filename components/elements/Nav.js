export default function Nav(cont, options) {

  const self = this;

  self.cont = cont;
  self.options = self.setupDefaults(options);

  self.elements = {};
  self.elements.nav = self.cont.append("div").attr("class", "nav")
  self.elements.view = self.cont.append("div").attr("class", "view")

  self.stylize();
}

Nav.prototype.stylize = function() {
  const self = this;

  self.cont.style("display", "flex").style("flex-direction", "column")
  self.elements.nav.style("display", "flex").style("flex-wrap", "wrap")
  self.elements.view.style("flex-grow", "2").style("overflow-y", "auto")
}

Nav.prototype.addElement = function (d) {
  const self = this;

  const tab = self.elements.nav.append("div").attr("class", "tab-el").attr("data-w", d.label)

  tab.style("cursor", "pointer").style("padding", "1px 10px").style("margin-bottom", "1px").style("border", "2px solid darkblue")

  tab.html(d.label)
  tab.on("click", function () {
    self.changeTab(d)
  })

  if (d.cont) {
    const view = self.elements.view.append("div")
      .attr("class", "view-el")
      .attr("data-w", d.label)
      .style("height", "100%")
      .style("position", "relative")

    view.style("display", "none")

    view.node().appendChild(d.cont)
  }

  const setActive = () => {
    self.changeTab(d)
  };

  return {setActive};
}

Nav.prototype.changeTab = function (d) {
  const self = this;

  self.options.active_tab = d.label;

  self.options.onTabChange(d)

  self.elements.nav.selectAll(".tab-el").each(function () {
    const tab = d3.select(this);
    const tab_label = tab.attr("data-w")
    if (self.options.active_tab === tab_label) {
      tab.style("background-color", "darkblue").style("color", "white")
    } else {
      tab.style("background-color", "white").style("color", "black")
    }
  })

}

Nav.prototype.setupDefaults = function(options) {
  const self = this;

  const options_default = {
    onTabChange: function () {
      self.elements.view.selectAll(".view-el").each(function () {
        const view = d3.select(this);
        const tab_label = view.attr("data-w")
        view.style("display", tab_label === self.options.active_tab ? "block" : "none")
      })
    }
  }

  return _.defaultsDeep(options || {}, options_default)
}



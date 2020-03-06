import helper from "../../../helper/index.js"
import filtering from "../helpers/filtering.js";

export default class {
  constructor(cont, options, store) {

    const CI = this;

    CI.root_cont = d3.select(cont);
    CI.options = options;
    CI.style = CI.options.style;
    CI.store = store;

    CI.main_cont = (() => {
      if (CI.options.resizable) return helper.style.Resizable(CI.root_cont, CI.style.dim, CI.resize.bind(CI));
      else return CI.root_cont.append("div")
    })();

    CI.filterDispatchLazy = ((f, s) => {
      let t = setTimeout(() => {},1);
      return () => {
        clearTimeout(t);
        t = setTimeout(f,s);
      }
    })(
      () => {
        CI.store.filter.run()
        CI.store.event.trigger("data_change")
        CI.store.event.trigger("all")
      }, 500);

    CI.active_filters = [];
    CI.store.filter.add(CI.filter.bind(CI))

    CI.initialize();
  }

  resize() {}

  update(type, opt) {
    const CI = this;

    const c = (l, el) => l.indexOf(el) !== -1
    if (c(["all"], type)) CI.updateFilterChooser();
  }

  initialize() {
    const CI = this;

    CI.main_cont.append("div")
      .attr("class", "filter_chooser")

    CI.main_cont.append("div")
      .attr("class", "active_filters")
  }

  updateFilterChooser() {
    const CI = this;
    const data = CI.store.get("data")
    const keys = Object.keys(data.length > 0 ? data[0] : {}).sort()
    const filter_chooser_cont = CI.main_cont.select("div.filter_chooser")
    filter_chooser_cont.html("")
    const select = filter_chooser_cont.append("select")
      .on("change", changed)

    select.append("option").attr("value", "").html("choose filter")
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      select.append("option").attr("value", key).html(key)
    }

    function changed() {
      let filter_key = select.node().value;
      if (filter_key) CI.addFilter(filter_key, {})
    }

    if (CI.options.freq_filters) {
      CI.options.freq_filters.forEach(d => {
        filter_chooser_cont.append("button").on("click", () => {
          CI.addFilter(d.key, d)
          CI.filterDispatchLazy()
        })
          .html(d.label)
      })
    }
  }

  addFilter(key, opt) {
    const CI = this;

    const filter = {};
    CI.active_filters.push(filter)

    filter.key = key;
    filter.filter = function (d) {
      return filtering.keyFiltering(d, key, filter.condition, filter.value)
    }

    const cont = CI.main_cont
      .select("div.active_filters")
      .append("div")
      .style("padding", "10px 2px")

    cont
      .append("div")
      .append("span")
      .style("padding", "2px")
      .html(key);

    const condition_select = cont.append("div").append("select")
      .style("padding", "2px")
      .on("change", conditionChange)

    const conditions = ["", "==", "!=", "have", "have-not", "<", ">"];
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      condition_select
        .append("option")
        .attr("value", condition)
        .html(condition);
    }

    function conditionChange() {
      filter.condition = condition_select.node().value;
      CI.filterDispatchLazy();
    }

    const value_input = cont
      .append("div")
      .style("padding", "2px")
      .append("input")
      .style("max-width", "100%")
      .attr("placeholder", "value")
      .on("input", function() {
        filter.value = this.value;
        CI.filterDispatchLazy();
      });


    let config_cont = cont.append("div").style("text-align", "right");
    config_cont
      .append("a")
      .attr("href", "javascript:void(0)")
      .style("padding", "5px")
      .html("help");

    config_cont
      .append("a")
      .attr("href", "javascript:void(0)")
      .style("color", "red")
      .style("padding", "5px")
      .style("margin-left", "5px")
      .html("close")
      .on("click", function() {
        CI.active_filters = CI.active_filters.filter(filter0 => filter0 !== filter)
        cont.remove();
        CI.filterDispatchLazy();
      });

    if (opt.condition) {
      condition_select.node().value = filter.condition = opt.condition
    }

    if (opt.value) {
      value_input.node().value = filter.value = opt.value
    }
  };

  filter(d) {
    const CI = this;

    let pass = true;
    for (let i = 0; i <  CI.active_filters.length; i++) {
      const filter = CI.active_filters[i];
      pass = filter.filter(d);
      if (!pass) break
    }
    return pass
  }
}

import Nav from "./Nav.js"
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
      else return CI.root_cont.append("div")
    })();
    CI.elements = {}

    CI.initialize();
  }

  resize() {}

  initialize() {
    const CI = this;

    CI.nav = new Nav(CI.main_cont, {})
    CI.addElement = d => CI.nav.addElement(d)
  }
}
export default class VizDatum {

  constructor(data) {
    const CI = this;
    CI.data = data;
    CI.enter = true;
    CI.attrs = {}
    CI.exit = false;
    CI.trans = {};
  }

  attr(key, value, trans) {
    const CI = this;

    if (value === CI.attrs[key]) return CI

    if (trans && trans.tt !== 0) {
      if (!CI.trans.hasOwnProperty(key) || CI.trans[key].end !== value) {
        CI.trans[key] = {start:CI.attrs[key], end: value, trans:trans}
      }
    } else {
      CI.attrs[key] = value;
    }
    return CI
  }

  calc(t) {
    const CI = this;

    Object.keys(CI.trans).forEach(key => {
      const datum = CI.trans[key];
      const trans = datum.trans;

      const time_scale = d3.scaleLinear().domain([0, trans.tt]).range([0,1]);

      const time = time_scale((t + trans.dt) - trans.t);

      if (time < 0) return;

      else if (time > 1) {
        if (trans.endCallback) trans.endCallback();

        delete CI.trans[key];
      }

      else CI.attrs[key] = d3.interpolate(datum.start, datum.end)(time);

    })

  }

}

import helper from "../../../../../../../helper/index.js";
import MultiLineChart from "../../index.js"

export default function() {
  return helper.dashboard_templates.basic({
    data_url: "/data/covid_19_data.csv",
    chartModel: MultiLineChart,
    options: {
      style: { pos: [0.02, 0.7, 0.7, 0.02] },
      resizable: true,
      configuration: {
        cls: {getter: d => d["Province/State"] + "\t" + d["Country/Region"], type: "string"},
        x_axis: {getter: "ObservationDate", type: "date", time_format: "%m/%d/%Y"},
        y_axis: {getter: "Deaths", type: "number"},
        type: "total"
      },
    }
  });
}

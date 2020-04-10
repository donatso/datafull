import helper from "../../../../../../../helper/index.js";
import OneLineChart from "../../index.js";

export default function() {
  return helper.dashboard_templates.basic({
    data_url: "/data/USvideos.tsv",
    chartModel: OneLineChart,
    options: {
      style: { pos: [0.02, 0.7, 0.7, 0.02] },
      resizable: true,
      configuration: {
        cls: {getter: d => "_", type: "string"},
        x_axis: {getter: "views", key: "views", type: "number"},
        y_axis: {getter: "__frequency", type: "number"},
      }
    }
  });
}

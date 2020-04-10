import helper from "../../../../../../../helper/index.js";
import MultiLineChart from "../../index.js";

export default function() {
  return helper.dashboard_templates.basic({
    data_url: "/data/heart.csv",
    chartModel: MultiLineChart,
    options: {
      style: { pos: [0.02, 0.7, 0.7, 0.02] },
      resizable: true,
      configuration: {
        cls: {getter: d => "_", type: "string"},
        x_axis: {getter: "age", type: "number"},
        y_axis: {getter: "chol", type: "number"},
        type: "total"
      },
    }
  });
}

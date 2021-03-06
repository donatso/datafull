import helper from "../../../../../../helper/index.js";
import LineBrush from "../index.js"

export default function() {
  return helper.dashboard_templates.basic({
    data_url: "/data/USvideos.tsv",
    chartModel: LineBrush,
    options: {
      style: { pos: [0.52, 0.7, 0.7, 0.02] },
      resizable: true,
      configuration: {
        x_axis: { key: "views", type: "number" },
        y_axis: { key: "__frequency", type: "number" }
      }
    }
  });
}

import helper from "../../../../../../../helper/index.js";
import BasicLineChart from "../../index.js";

export default function() {
  return helper.dashboard_templates.basic({
    data_url: "/data/USvideos.tsv",
    chartModel: BasicLineChart,
    options: {
      style: { pos: [0.02, 0.7, 0.7, 0.02] },
      resizable: true,
      configuration: {
        x_axis: {value: "trending_date", treat_as: {value: 'date'}},
        y_axis: {value: "views", treat_as: {value: 'number'}},
        type: {value: "total"}
      },
    }
  });
}

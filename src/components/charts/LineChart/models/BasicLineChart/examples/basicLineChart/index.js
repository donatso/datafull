import helper from "../../../../../../../helper/index.js";
import BasicLineChart from "../../index.js";

export default function() {
  return helper.dashboard_templates.basic({
    data_url: "/data/covid_19_data.csv",
    chartModel: BasicLineChart,
    options: {
      style: { pos: [0.02, 0.7, 0.7, 0.02] },
      resizable: true,
      configuration: {
        cls: {value: null, treat_as: {value: "string"}},
        x_axis: {value: "ObservationDate", treat_as: {value: 'date'}},
        y_axis: {value: "Deaths", treat_as: {value: 'number'}},
        type: {value: "total"}
      },
    }
  });
}

global.d3 = Object.assign(
  {},
  require("../../../../offline_plugins/d3"),
  require("../../../../offline_plugins/d3-array")
  )

global._ = require("../../../../offline_plugins/lodash")

import helper from '../../../helper/index.js'
import classify from './'

describe("basic classify test", () => {
  let data = [
    {cls: "denis", cls2: "tenis", value: 0},
    {cls: "denis", cls2: "tenis", value: 10},
    {cls: "denis", cls2: "tenis", value: 20},
    {cls: "denis", cls2: "tenis", value: 30},
    {cls: "denis", cls2: "tenis", value: 40},
    {cls: "penis", cls2: "tenis", value: 50},
    {cls: "penis", cls2: "tensis", value: 60},
    {cls: "penis", cls2: "tenis", value: 70},
    {cls: "penis", cls2: "tenis", value: 80},
    {cls: "penis", cls2: "tenis", value: 90},
    {cls: "penis", cls2: "tenis", value: 100}
  ];
  test('single class', () => {
    let classified = classify.classifyData(data, "cls","value", {value: 'string'})
  });
  test('multi class', () => {
    let classified = classify.classifyData(data, ["cls", "cls2"],"value", {value: 'string'})
    // console.log(classified)
  });
});

describe("corona data test", () => {
  test('multi class multi node', async function () {
    let data = await helper.query.loadData('/data/covid_19_data.csv')
    let classified = classify.classifyData(data, ["Province/State", "Country/Region"], {value: 'string'})
    let classified3 = classify.classifyData3(classified, "ObservationDate", "Confirmed")

  });

  test('multi class multi node with d3 group', async function () {
    let data = await helper.query.loadData('/data/covid_19_data.csv');
    const dim3 = d => d["Province/State"] + "\t" + d["Country/Region"];
    const dim2 = "ObservationDate"

    const classified3 = classify.group(data, dim3, dim2)
    console.log(classified3['Anhui\tMainland China'])
  });
})


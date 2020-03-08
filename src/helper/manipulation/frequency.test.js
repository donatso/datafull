global.d3 = require("../../../offline_plugins/d3")
global._ = require("../../../offline_plugins/lodash")

import frequency from './frequency.js'

describe("main", () => {
  let data = [
    {value: 0},
    {value: 10},
    {value: 20},
    {value: 30},
    {value: 40},
    {value: 50},
    {value: 60},
    {value: 70},
    {value: 80},
    {value: 90},
    {value: 100}
  ];
  test('check if all values are counted', () => {
    data = [...Array(100)].map(() => ({value: Math.random()*1000}))
    const frequency_data = frequency.createFrequencyData(data, "value", {steps_count: 5})
    expect(d3.sum(Object.values(frequency_data))).toBe(data.length)
  });
})


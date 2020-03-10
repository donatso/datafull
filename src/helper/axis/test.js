const app_root = process.cwd() + "/.."
global.d3 = require(app_root+"/offline_plugins/d3");
global._ = require(app_root+"/offline_plugins/lodash");
require(app_root)

import axis from './index.js'

describe("scale test", () => {
  let data = [
    {x_value: "denis", y_value: 0, z_value: new Date("2020-01-01")},
    {x_value: "denis", y_value: 10, z_value: new Date("2020-01-02")},
    {x_value: "denis", y_value: 20, z_value: new Date("2020-01-03")},
    {x_value: "denis", y_value: 30, z_value: new Date("2020-01-04")},
    {x_value: "denis", y_value: 40, z_value: new Date("2020-01-05")},
    {x_value: "penis", y_value: 50, z_value: new Date("2020-01-06")},
    {x_value: "penis", y_value: 60, z_value: new Date("2020-01-07")},
    {x_value: "penis", y_value: 70, z_value: new Date("2020-01-08")},
    {x_value: "tenis", y_value: 80, z_value: new Date("2020-01-09")},
    {x_value: "tenis", y_value: 90, z_value: new Date("2020-01-10")},
    {x_value: "tenis", y_value: 100, z_value: new Date("2020-01-10")},
  ];
  const configuration = {
    string: {treat_as: {value: "string"}},
    number: {treat_as: {value: "number"}},
    date: {treat_as: {value: "date"}}
  }
  test('check if string scale return correct value', () => {
    const d3Scale = axis.setupScales(data, configuration.string, "x_value", [0,10])
    expect(+d3Scale("penis").toFixed(2)).toBe(3.33)
  });
  test('check if number scale return correct value', () => {
    const d3Scale = axis.setupScales(data, configuration.string, "y_value", [0,10])
    expect(+d3Scale(30).toFixed(2)).toBe(2.73)
  });
  test('check if date scale return correct value', () => {
    const d3Scale = axis.setupScales(data, configuration.string, "z_value", [0,10])
    expect(+d3Scale(new Date("2020-01-05")).toFixed(2)).toBe(4)
  });
})


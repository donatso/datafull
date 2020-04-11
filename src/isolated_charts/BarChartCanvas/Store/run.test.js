import run from './run';

global.d3 = require("d3")

describe("all", () => {
  test("getProgressValue", function () {
    const data = [
      {
        _date: new Date(2001, 1, 1),
        _value: 10
      },
      {
        _date: new Date(2003, 1, 1),
        _value: 20
      }
    ]
    {
      const date = new Date(2002,1,1)
      const value = run.getProgressValue(data, date)
      expect(value).toBe(15)
    }
    {
      const date = new Date(2004,1,1)
      const value = run.getProgressValue(data, date)
      expect(value).toBe(null)
    }
    {
      const date = new Date(2000,1,1)
      const value = run.getProgressValue(data, date)
      expect(value).toBe(null)
    }
  })
})


global.d3 = require(global.APP_ROOT+"/offline_plugins/d3");
global._ = require(global.APP_ROOT+"/offline_plugins/lodash");
require(global.APP_ROOT)

import example from './index.js'

describe("all", () => {
  test("main", async function () {
    const {chart, store} = await example();
  })
})


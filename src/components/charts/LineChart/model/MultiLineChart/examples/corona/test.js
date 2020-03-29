require(process.cwd() + "/offline_plugins");
require(process.cwd())

import example from './index.js'

describe("all", () => {
  test("main", async function () {
    const {chart, store} = await example();
  })
})


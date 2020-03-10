const app_root = process.cwd() + "/.."
global.d3 = require(app_root+"/offline_plugins/d3");
global._ = require(app_root+"/offline_plugins/lodash");
global.fetch = require(app_root+"/nodejs/node_modules/node-fetch/lib/index.js");
const fs = require("fs")
require(app_root)

describe("BasicLineChart test", () => {
  test("main", async function() {
      df.Store.inherit(Store);
      function Store() {
        df.Store.apply(this, arguments);
      }
      const dashboard_el = document.body.appendChild(document.createElement("div"))
      df.helper.style.stylize1(dashboard_el)

      const store = new Store();
      {
        store.data.datum_keys = [];
        store.event.on("data_change", function () {
          const data = store.data.active_data
          store.data.datum_keys = Object.keys(data.length > 0 ? data[0] : {}).sort()
        })
      }

      {
        const config = {
          style: {
            pos: [0.02, 0.7, 0.7, 0.02],
          },
          resizable: true,


          configuration: {
            x_axis:{value: "views", treat_as: {value: 'number'}},
            y_axis:{value: "__frequency", treat_as: {value: 'number'}},
          },
        };

        config.style.dim = df.helper.style.posToDim(config.style.pos);
        const cont = dashboard_el.appendChild(document.createElement("div"));
        const chart = new df.BasicLineChart(
          cont,
          config,
          store
        );
      }

      // throw "denis"

      const url = app_root + "/data/USvideos.tsv",
        DATA = await df.helper.query.loadData(url)

      store.data.insert(DATA, null);

      store.event.trigger("data_change")
      store.event.trigger("all")
  })
})


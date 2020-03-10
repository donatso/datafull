export default async function({data_url, chartModel, options}) {
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


  options.style.dim = df.helper.style.posToDim(options.style.pos);
  const cont = dashboard_el.appendChild(document.createElement("div"));
  const chart = new chartModel(
    cont,
    options,
    store
  );

  const DATA = await df.helper.query.loadData(data_url)
  store.data.insert(DATA, null);

  store.event.trigger("data_change")
  store.event.trigger("all")

  return {store, chart}
}
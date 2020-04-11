import Store from "./Store/index.js"

;(async function () {
  const store = new Store();
  let data = await setupData();

  store.initial(data);
  store.run()

})();

async function setupData() {
  let data = await getData()
  return fixData(data)

  async function getData() {
    const data_text = await fetch('./data/views.csv').then(resp => resp.text()),
      data = d3.dsvFormat(";").parse(data_text)
    return data
  }

  function fixData(data) {
    data.forEach(d => {
      d.value = d.value.replace(/,/g, "")
      d.date = d3.timeParse("%d.%m.%Y")(d.date)
    })
    return data
  }
}


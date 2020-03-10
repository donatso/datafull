async function loadData(url) {
  function parseData(data, data_type) {
    if (data_type === "json") data = JSON.parse(data);
    else if (data_type === "csv") data = d3.csvParse(data);
    else if (data_type === "tsv") data = d3.tsvParse(data);
    return data;
  }
  async function fetchData() {
    if (typeof process === "undefined") return fetch(url).then(r => r.text())
    else return require("fs").readFileSync(transformIfFileRequest(url), "utf8")  // for testing todo: better

    function transformIfFileRequest() {
      if (url.indexOf("http") === -1) return global.APP_ROOT + url
      else return url
    }

  }
  function getDataType() {
    return url.split(".").reverse()[0]
  }
  let DATA = [];
  try {
    DATA = await fetchData()
    DATA = await parseData(DATA, getDataType());
  } catch(e) {console.log(e)}
  return DATA;
}

export default {
  loadData
}
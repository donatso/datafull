async function loadData(url) {
  async function setupData(data_url) {
    let data;
    if (data_url.includes(".json")) data = await d3.json(data_url);
    else if (data_url.includes(".csv")) data = await d3.csv(data_url);
    return data;
  }
  let DATA = [];
  try {DATA = await setupData(url);} catch(e) {}
  return DATA;
}

export default {
  loadData
}
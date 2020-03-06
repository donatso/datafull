function Selector({config, label, onChange}) {
  const cont = d3.select(document.createElement("span"))
  cont.append("b").html(label);
  const select = cont.append("select");
  select.on("change", changed);
  ["", ...config.options].forEach(k => select.append("option").attr("value", k).html(k));
  select.node().value = config.value;

  function changed() {
    const value = select.node().value;
    config.value = value
    onChange()
  }

  return cont.node()
}

export default Selector;
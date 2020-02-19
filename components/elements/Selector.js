function Selector({cont, options, label, onChange}) {

  cont.append("b").html(label);
  const select = cont.append("select");
  select.on("change", changed);
  ["", ...options].forEach(k => select.append("option").attr("value", k).html(k));

  function changed() {
    const value = select.node().value;
    onChange(value)
  }

  function updateOptions(_options) {
    options = _options
    select.html("");
    ["", ...options].forEach(k => select.append("option").attr("value", k).html(k));
  }

  function updateValue(value, is_trigger) {
    select.node().value = value;
    if (is_trigger) changed()
  }

  function updateValueMaybe(value, is_trigger) {
    if (options.indexOf(value) !== -1) updateValue.apply(null, arguments)
  }

  return {
    updateOptions,
    updateValue,
    updateValueMaybe
  }
}

export default Selector;
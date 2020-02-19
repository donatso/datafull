export default (function () {

  function extractKeys(data) {
    let keys = [];
    const extractFromList = (l) => l.reduce((acc, l) => ((acc.indexOf(k) !== -1 || acc.push(k)), acc), [])
    if (Array.isArray(data)) keys = extractFromList(data)
    else keys = Object.values(data).map(l => keys.push(...extractFromList(l)))
    keys.sort()
    return keys.filter(k => k !== "__d")
  }

  function keyFiltering(d, key, condition, filt_value) {
    if (!condition || !filt_value) return true
    if (filt_value === "null") filt_value = null;

    if (condition === "==") {
      if (!d.hasOwnProperty(key)) return false;
      else return d[key] === filt_value;
    } else if (condition === "!=") {
      if (!d.hasOwnProperty(key)) return true;
      else return d[key] !== filt_value;
    } else if (condition === "have") {
      if (!d.hasOwnProperty(key)) return false;
      else return d[key].indexOf(filt_value) !== -1;
    } else if (condition === "have-not") {
      if (!d.hasOwnProperty(key)) return true;
      else return d[key].indexOf(filt_value) === -1;
    } else if (condition === ">") {
      if (!d.hasOwnProperty(key)) return false;
      else return d[key] > +filt_value;
    } else if (condition === "<") {
      if (!d.hasOwnProperty(key)) return false;
      else return d[key] < +filt_value;
    }
  }

  return {
    extractKeys,
    keyFiltering
  }
})()
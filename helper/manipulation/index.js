function numifyArrayOfObjects(data) {
  data.forEach(d => {
    for (let k in d) {
      if (!d.hasOwnProperty(k)) continue
      const n = parseFloat(d[k])
      if (!isNaN(n) && (""+n).length === d[k].length) d[k] = n
    }
  })
}

export default {
  numifyArrayOfObjects
}
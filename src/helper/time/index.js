function timeit(f, name, opt) {
  const opt_default = {
    loop: 1
  }
  const extend = (t, s) => Object.keys(s).reduce((acc, k) => (t.hasOwnProperty(k) ? acc[k] = t[k] : acc[k] = s[k], acc), {})
  opt = extend(opt || {}, opt_default)

  return function () {
    let rtrn;
    const start_time = new Date();
    for (let i = 0; i < opt.loop; i++) {
      rtrn = f(...arguments)
    }
    console.log(name + " took: " + ((new Date() - start_time) / opt.loop) + "ms")
    return rtrn
  }
}

export default {
  timeit
}
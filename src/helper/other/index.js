function lazyCall(fun, timeout_duration) {
  let timeout = setTimeout(()=>{}, timeout_duration)
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(fun, timeout_duration)
  }
}

export default {
  lazyCall
}
Vue.prototype.$t = (k) => game.i18n.localize(k)
Vue.prototype.$concat = (...args) => args.join('')
Vue.prototype.$capitalize = function(txt) {
  const [first, ...rest] = txt
  return `${first.toUpperCase()}${rest.join('')}`
}

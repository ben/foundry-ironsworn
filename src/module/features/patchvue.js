Vue.prototype.$t = (k) => game.i18n.localize(k)
Vue.prototype.$concat = (...args) => args.join('')
Vue.prototype.$capitalize = function (txt) {
  const [first, ...rest] = txt
  return `${first.toUpperCase()}${rest.join('')}`
}
Vue.prototype.$enrichHtml = (text) => {
  const rendered = TextEditor.enrichHTML(text)
  const rollText = game.i18n.localize('IRONSWORN.Roll')
  return rendered.replace(
    /\(\(rollplus (.*?)\)\)/g,
    (_, stat) => `
      <a class="inline-roll" data-param="${stat}">
        <i class="fas fa-dice-d6"></i>
        ${rollText} +${game.i18n.localize(`IRONSWORN.${Vue.prototype.$capitalize(stat)}`).toLowerCase()}
      </a>
    `
  )
}

; (() => {
  Vue.prototype.$t = (k) => game.i18n.localize(k)
  Vue.prototype.$concat = (...args) => args.join('')
  Vue.prototype.$capitalize = function (txt) {
    const [first, ...rest] = txt
    return `${first.toUpperCase()}${rest.join('')}`
  }
  function enrichHtml(text) {
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
  Vue.prototype.$enrichHtml = enrichHtml
  Vue.prototype.$enrichMarkdown = (md) => {
    const html = CONFIG.IRONSWORN.marked.parse(md)
    return enrichHtml(html)
  }

  Object.defineProperty(Vue.prototype, '$item', {
    get: function () {
      const actorId = this.item?.parent?._id ?? this.actor?._id
      if (actorId) {
        const actor = game.actors?.get(actorId)
        const item = actor?.items.get(this.item._id)
        if (item) return item
      }
      return game.items?.get(this.item._id)
    },
  })

  Object.defineProperty(Vue.prototype, '$actor', {
    get: function () {
      return game.actors?.get(this.actor?._id)
    },
  })
})()

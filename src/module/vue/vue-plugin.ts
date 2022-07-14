import { Plugin } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (string) => string
    $concat: (...args: any[]) => string
    $enrichMarkdown: (string) => string
  }
}

const plugin: Plugin = {
  install(app, ..._options) {
    app.config.globalProperties.$t = (k) => game.i18n.localize(k)
    app.config.globalProperties.$concat = (...args) => args.join('')
    app.config.globalProperties.$capitalize = function (txt) {
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
        ${rollText} +${game.i18n
          .localize(
            `IRONSWORN.${app.config.globalProperties.$capitalize(stat)}`
          )
          .toLowerCase()}
      </a>
    `
      )
    }
    app.config.globalProperties.$enrichHtml = enrichHtml
    app.config.globalProperties.$enrichMarkdown = (md) => {
      const html = CONFIG.IRONSWORN.marked.parse(md)
      return enrichHtml(html)
    }

    Object.defineProperty(app.config.globalProperties, '$item', {
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

    Object.defineProperty(app.config.globalProperties, '$actor', {
      get: function () {
        return game.actors?.get(this.actor?._id)
      },
    })
  },
}

export default plugin

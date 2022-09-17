import { marked } from 'marked'
import { Plugin } from 'vue'
import { formatRollPlusStat } from '../rolls/ironsworn-roll-message.js'
import { $EnrichHtmlKey, $EnrichMarkdownKey } from './provisions'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Without a `data` parameter: shortcut for {@link game.i18n.localize}.
     * With a `data` parameter: shortcut for {@link game.i18n.format}.
     */
    $t: (stringId: string, data?: Record<string, unknown>) => string
    $capitalize: (string) => string
    $concat: (...args: any[]) => string
    $enrichMarkdown: (string) => string
    $enrichHtml: (string) => string
  }
}

export function enrichHtml(text) {
  const rendered = TextEditor.enrichHTML(text)
  return rendered.replace(
    /\(\(rollplus (.*?)\)\)/g,
    (_, stat) => `
  <a class="inline-roll" data-param="${stat}">
    <i class="fas fa-dice-d6"></i>
    ${formatRollPlusStat(stat)}
  </a>
`
  )
}

export function enrichMarkdown(md: string): string {
  const html = marked.parse(md)
  return enrichHtml(html)
}

export const IronswornVuePlugin: Plugin = {
  install(app, ..._options) {
    app.config.globalProperties.$t = (
      stringId: string,
      data?: Record<string, unknown>
    ) =>
      data ? game.i18n.format(stringId, data) : game.i18n.localize(stringId)
    app.config.globalProperties.$concat = (...args) => args.join('')
    app.config.globalProperties.$capitalize = function (txt) {
      const [first, ...rest] = txt
      return `${first.toUpperCase()}${rest.join('')}`
    }
    app.config.globalProperties.$enrichHtml = enrichHtml
    app.provide($EnrichHtmlKey, enrichHtml)

    app.config.globalProperties.$enrichMarkdown = enrichMarkdown
    app.provide($EnrichMarkdownKey, enrichMarkdown)

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

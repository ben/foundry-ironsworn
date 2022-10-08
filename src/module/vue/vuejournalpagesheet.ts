import { App, Component, ComponentPublicInstance, createApp } from 'vue'
import { $PageKey } from './provisions'
import { VueSheetRenderHelperOptions } from './vue-render-helper'
import { IronswornVuePlugin } from './vue-plugin'

declare global {
  class JournalPageSheet extends DocumentSheet {
    static get defaultOptions(): DocumentSheetOptions
  }
}

export abstract class VueJournalPageSheet extends JournalPageSheet {
  vueApp: App<Element> | undefined
  vueRoot: ComponentPublicInstance | undefined

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['ironsworn', 'page'],
      width: 520,
      height: 480,
    })
  }

  abstract get renderHelperOptions(): Partial<VueSheetRenderHelperOptions>

  setupVueApp(app: App) {
    app.provide($PageKey, this.object)
  }

  async _renderInner(input) {
    console.log(input)
    const rhopts = this.renderHelperOptions

    if (!this.vueApp || !this.vueRoot) {
      this.vueRoot = undefined
      this.vueApp = createApp({
        data() {
          return { data: input }
        },

        components: rhopts.components,

        provide: {
          $PageKey: input.document,
        },

        methods: {
          updateData(newData) {
            for (const k of Object.keys(this.data)) {
              this.data[k] = newData[k]
            }
          },
        },
      })
      this.vueApp.config.unwrapInjectedRef = true
      this.vueApp.use(IronswornVuePlugin)
    } else {
      this.vueRoot.updateData(input)
    }

    let html: typeof jQuery
    try {
      html = await super._renderInner(input)

      const events = []
      const rawEl = html[0]
      for (const key in rawEl) {
        if (key.indexOf('on') === 0) {
          events.push(key.slice(2))
        }
      }
      console.log(events)
      html.on(events.join(' '), console.log)

      const selector = '.vueroot'
      let $appEl = html.find(selector)
      if ($appEl.length > 0) {
        this.vueRoot = this.vueApp.mount($appEl[0])
      }
    } catch (err: any) {
      Hooks.onError('Application#render', err, {
        msg: `An error occurred while rendering ${this.constructor.name}`,
        log: 'error',
        input,
      })
      console.error(
        `An error occurred while rendering ${this.constructor.name}: ${err.message}`,
        err
      )
    }

    return html
  }

  close() {
    this.vueApp?.unmount()
    this.vueApp = undefined
    this.vueRoot = undefined
    return super.close()
  }
}

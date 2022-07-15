import { App, Component, ComponentPublicInstance, createApp, ref } from 'vue'
import mitt from 'mitt'
import { IronswornSettings } from '../helpers/settings'
import { IronswornVuePlugin } from './vue-plugin'

export interface VueSheetRenderHelperOptions {
  vueData: () => Promise<Record<string, any>>
  components: { [k: string]: Component }
  provides: { [k: string]: any }
}

export class VueSheetRenderHelper {
  vueApp: App | undefined
  vueRoot: ComponentPublicInstance | undefined
  emitter: ReturnType<typeof mitt>
  options: VueSheetRenderHelperOptions

  constructor(
    protected app: Application,
    options?: Partial<VueSheetRenderHelperOptions>
  ) {
    this.options = {
      vueData: async () => ({}),
      components: {},
      provides: {},
      ...options,
    }
    this.emitter = mitt()
    this.emitter.on('closeApp', () => this.app.close())
  }

  async render(...renderArgs) {
    const data = (await this.options.vueData()) as any

    console.log(this.vueApp, data)
    if (this.vueApp) {
      // Pass new values into the app
      ;(this.vueRoot as any).updateContext(data)
      return
    }

    // Render the Vue app
    this.vueApp = createApp({
      data() {
        return { data: ref(data) }
      },

      components: this.options.components,

      provide: {
        context: {
          options: this.app.getDataoptions,
          themeClass: `theme-${IronswornSettings.theme}`,
          config: CONFIG.IRONSWORN,
        },
        ...this.options.provides,
      },

      methods: {
        updateContext(newCtx) {
          for (const k of Object.keys(this.data)) {
            this.data[k] = newCtx[k]
          }
        },
      },
    })
    this.vueApp.use(IronswornVuePlugin)

    try {
      // Execute Foundry's render.
      await this.app._render(...renderArgs)

      // Run Vue's render, assign it to our prop for tracking.
      this.vueRoot = this.vueApp.mount(
        `[data-appid="${this.app.appId}"] .vueroot`
      )
      this.activateVueListeners($(this.app.element), false)
    } catch (err: any) {
      this.app._state = Application.RENDER_STATES.ERROR
      Hooks.onError('Application#render', err, {
        msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
        log: 'error',
        ...renderArgs,
      })
      console.error(
        `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`,
        err
      )
    }

    return this
  }

  close() {
    this.vueApp?.unmount()
    this.vueApp = this.vueRoot = undefined
  }

  /**
   * Activate additional listeners on the rendered Vue app.
   * @param {jQuery} html
   */
  activateVueListeners(html: JQuery, repeat = false) {
    this._dragHandler(html)

    // Place one-time executions after this line.
    if (repeat) return

    // Input listeners.
    const inputs = '.section input[type="text"], .section input[type="number"]'
    html.on('focus', inputs, (event) => this._onFocus(event))
  }

  _onFocus(event) {
    const target = event.currentTarget
    setTimeout(() => {
      if (target == document.activeElement) {
        $(target).trigger('select')
      }
    }, 100)
  }

  _dragHandler(html: JQuery) {
    const dragHandler = (event) => this.app._onDragStart(event)
    html.find('.item[data-draggable="true"]').each((i, li) => {
      li.setAttribute('draggable', true)
      li.addEventListener('dragstart', dragHandler, false)
    })
  }
}

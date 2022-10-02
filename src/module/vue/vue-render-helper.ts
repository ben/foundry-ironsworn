import { App, Component, ComponentPublicInstance, createApp } from 'vue'
import { IronswornSettings } from '../helpers/settings'
import { IronswornVuePlugin } from './vue-plugin'

export interface VueSheetRenderHelperOptions {
  vueData: () => Promise<Record<string, any>>
  components: { [k: string]: Component }
  helperHook?: (helper: VueSheetRenderHelper) => any
}

export class VueSheetRenderHelper {
  vueApp: App<Element> | undefined
  vueRoot: ComponentPublicInstance | undefined
  options: VueSheetRenderHelperOptions
  vueListenersActive = false

  constructor(
    protected app: Application,
    options?: Partial<VueSheetRenderHelperOptions>,
    protected appHook?: (App) => void
  ) {
    this.options = {
      vueData: async () => ({}),
      components: {},
      ...options,
    }
    CONFIG.IRONSWORN.emitter.on('closeApp', () => this.app.close())

    this.options.helperHook?.(this)
  }

  async render(...renderArgs) {
    const data = (await this.options.vueData()) as any

    // Create the Vue App instance
    if (!this.vueApp || !this.vueRoot) {
      this.vueRoot = undefined
      this.vueApp = createApp({
        data() {
          return { data: data }
        },

        components: this.options.components,

        provide: {
          context: {
            options: this.app.options,
            themeClass: `theme-${IronswornSettings.theme}`,
            config: CONFIG.IRONSWORN,
          },
        },

        methods: {
          updateData(newCtx) {
            for (const k of Object.keys(this.data)) {
              this.data[k] = newCtx[k]
            }
          },
        },
      })
      this.vueApp.config.unwrapInjectedRef = true
      this.vueApp.use(IronswornVuePlugin)
      this.appHook?.(this.vueApp)
    } else {
      ;(this.vueRoot as any).updateData(data)
      if (!this.vueListenersActive) {
        setTimeout(() => {
          this.activateVueListeners($(this.app.element), true)
        }, 150)
      }
      return
    }

    // Stop here if we're closing
    if (this.app['_state'] === Application.RENDER_STATES.CLOSING) return

    // No active Vue root, so run Foundry's render and mount it
    try {
      // Execute Foundry's render.
      await this.app['_render'](...renderArgs)

      // Run Vue's render, assign it to our prop for tracking.
      const selector = `[data-appid="${this.app.appId}"] .vueroot`
      let $appEl = $(selector)
      if ($appEl.length > 0) {
        this.vueRoot = this.vueApp.mount(selector)
        setTimeout(() => {
          this.activateVueListeners($(this.app.element), true)
        }, 150)
      }
    } catch (err: any) {
      this.app['_state'] = Application.RENDER_STATES.ERROR
      Hooks.onError('Application#render', err, {
        msg: `An error occurred while rendering ${this.constructor.name} ${this.app.id}`,
        log: 'error',
        ...renderArgs,
      })
      console.error(
        `An error occurred while rendering ${this.constructor.name} ${this.app.id}: ${err.message}`,
        err
      )
    }

    if (this.app instanceof FormApplication) {
      this.app.object.apps[this.app.appId] = this.app
    }
  }

  close() {
    this.vueApp?.unmount()
    this.vueApp = undefined
    this.vueRoot = undefined
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
    const dragHandler = (event) => this.app['_onDragStart'](event)
    html.find('.item[data-draggable="true"]').each((i, li) => {
      li.setAttribute('draggable', 'true')
      li.addEventListener('dragstart', dragHandler, false)
    })
  }
}

import { App, Component, ComponentPublicInstance, createApp } from 'vue'
import { IronswornSettings } from '../helpers/settings'
import IronswornPlugin from '../vue/vue-plugin'
import mitt from 'mitt'

export abstract class VueApplication extends Application {
  vueApp: App | undefined
  vueRoot: ComponentPublicInstance | undefined

  /** @override */
  constructor(options?: Partial<ApplicationOptions>) {
    super(options)
    this.vueApp = undefined
    this.vueRoot = undefined
  }

  async getData(_options?: Partial<ApplicationOptions>) {
    return {
      context: {
        options: this.options,
        themeClass: `theme-${IronswornSettings.theme}`,
        config: CONFIG.IRONSWORN,
        emitter: mitt(),
      },
      ...(await this.getVueData()),
    }
  }

  abstract getVueData(): Promise<Record<string, any>>

  async render(force?: boolean, inputOptions?: Application.RenderOptions) {
    const data = await this.getData()

    data.context.emitter.on('closeApp', () => this.close())

    if (this.vueApp) {
      // Pass new values into the app
      ;(this.vueRoot as any).updateContext(data)
      return
    }

    // Render the Vue app
    this.vueApp = createApp({
      data() {
        return data
      },

      components: this.getComponents(),

      methods: {
        updateContext(newCtx) {
          for (const k of Object.keys(this.context)) {
            this.context[k] = newCtx[k]
          }
        },
      },
    })
    this.vueApp.provide('context', data.context)
    this.vueApp.use(IronswornPlugin)

    try {
      // Execute Foundry's render.
      await this._render(force, inputOptions)
      // Run Vue's render, assign it to our prop for tracking.
      this.vueRoot = this.vueApp.mount(`[data-appid="${this.appId}"] .vueroot`)
      this.activateVueListeners($(this.element), false)
    } catch (err: any) {
      this._state = Application.RENDER_STATES.ERROR
      Hooks.onError('Application#render', err, {
        msg: `An error occurred while rendering ${this.constructor.name} ${this.appId}`,
        log: 'error',
        ...inputOptions,
      })
      console.error(
        `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`,
        err
      )
    }

    return this
  }

  /**
   * Implement to provide root component
   */
  getComponents(): { [k: string]: Component } {
    return {}
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

  _dragHandler(html) {
    const dragHandler = (event) => this._onDragStart(event)
    html.find('.item[data-draggable="true"]').each((i, li) => {
      li.setAttribute('draggable', true)
      li.addEventListener('dragstart', dragHandler, false)
    })
  }
}

import { App, ComponentPublicInstance, createApp } from 'vue'
import { IronswornSettings } from '../helpers/settings'

export abstract class VueApplication extends Application {
  vueApp: App | undefined
  vueRoot: ComponentPublicInstance | undefined

  /** @override */
  constructor(options) {
    super(options)
    this.vueApp = undefined
    this.vueRoot = undefined
  }

  static get defaultOptions(): ApplicationOptions {
    return mergeObject(super.defaultOptions, {
      classes: [
        'ironsworn',
        'sheet',
        'item',
        `theme-${IronswornSettings.theme}`,
      ],
    })
  }

  async getData(_options?: Partial<ApplicationOptions>): Promise<object> {
    console.log(await this.getVueData())
    return {
      context: {
        options: this.options,
        themeClass: `theme-${IronswornSettings.theme}`,
        config: CONFIG.IRONSWORN,
      },
      ...(await this.getVueData()),
    }
  }

  abstract getVueData(): Promise<object>

  async render(force?: boolean, inputOptions?: Application.RenderOptions) {
    const context = await this.getData()
    console.log(context)

    if (this.vueApp) {
      // Pass new values into the app
      ;(this.vueRoot as any).updateContext(context)
      return
    }

    console.log(this.getComponents())

    // Render the Vue app
    this.vueApp = createApp({
      data() {
        return { context }
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

    try {
      // Execute Foundry's render.
      await this._render(force, inputOptions)
      // Run Vue's render, assign it to our prop for tracking.
      this.vueRoot = this.vueApp.mount(`[data-appid="${this.appId}"] .vueroot`)
      console.log(this.vueRoot)
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
  getComponents(): { [k: string]: any } {
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

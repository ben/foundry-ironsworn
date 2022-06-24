import Vue from 'vue'
import { IronswornSettings } from '../helpers/settings'

export class VueApplication extends Application {
  _vm: (Vue & Record<string, any>) | null

  /** @override */
  constructor(options) {
    super(options)
    this._vm = null
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

  async render(force?: boolean, inputOptions?: Application.RenderOptions) {
    const options: Application.RenderOptions = inputOptions ?? {}
    const appData = (await this.getData()) as any

    // Exit if Vue has already rendered.
    if (this._vm) {
      const states = Application.RENDER_STATES
      if (this._state == states.RENDERING || this._state == states.RENDERED) {
        // Update the Vue app with our updated item/flag data.
        for (const k of Object.keys(appData)) {
          Vue.set(this._vm, k, appData[k])
        }
        this.activateVueListeners($(this.element), true)
        return this
      }
      // TODO: Is destroying the app necessary?
      // else {
      //   this._vm.$destroy();
      //   this._vm = null;
      // }
    }
    // Run the normal Foundry render once.
    this._render(force, options)
      .catch((err) => {
        err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`
        console.error(err)
        this._state = Application.RENDER_STATES.ERROR
      })
      // Run Vue's render, assign it to our prop for tracking.
      .then((_rendered) => {
        // Prepare the item data.
        const el = this.element.find('.ironsworn-vueport')
        // Render Vue and assign it to prevent later rendering.
        VuePort.render(null, el[0], { data: appData }).then((vm) => {
          this._vm = vm
          const html = $(this.element)
          this.activateVueListeners(html)
        })
      })

    // Return per the overridden method.
    return this
  }

  /**
   * Activate additional listeners on the rendered Vue app.
   * @param {jQuery} html
   */
  activateVueListeners(html: JQuery, repeat = false) {
    // Place one-time executions after this line.
    if (repeat) return

    // Input listeners.
    const inputs = '.section input[type="text"], .section input[type="number"]'
    html.on('focus', inputs, (event) => this._onFocus(event))
  }

  _onFocus(event) {
    const target = event.currentTarget
    setTimeout(function () {
      if (target == document.activeElement) {
        $(target).trigger('select')
      }
    }, 100)
  }
}

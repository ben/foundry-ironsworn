import { App } from 'vue'
import {
  VueSheetRenderHelper,
  VueSheetRenderHelperOptions,
} from './vue-render-helper.js'

type Constructor<T = object> = new (...args: any[]) => T

export function VueMixin<
  TBase extends Constructor<Application> & {
    defaultOptions: ApplicationOptions
  }
>(Base: TBase) {
  return class VueMixin extends Base {
    renderHelper: VueSheetRenderHelper | undefined

    static get defaultOptions(): ApplicationOptions {
      return mergeObject(super.defaultOptions, {
        classes: ['ironsworn'],
      })
    }

    get renderHelperOptions(): Partial<VueSheetRenderHelperOptions> {
      return {}
    }

    setupVueApp(app: App) {
      // Nowt to do here
    }

    render(force?: boolean, inputOptions?: Application.RenderOptions) {
      this.renderHelper ||= new VueSheetRenderHelper(
        this,
        this.renderHelperOptions,
        this.setupVueApp.bind(this)
      )
      this.renderHelper.render(force, inputOptions)
      return this
    }

    async close(options?: Application.CloseOptions | undefined) {
      this.renderHelper?.close()
      return super.close(options)
    }

    /**
     * Activate additional listeners on the rendered Vue app.
     */
    activateVueListeners(html: JQuery, repeat = false) {
      this._dragHandler(html)

      // Place one-time executions after this line.
      if (repeat) return

      // Input listeners.
      const inputs =
        '.section input[type="text"], .section input[type="number"]'
      html.on('focus', inputs, (event) => this._onFocus(event))
    }

    _onFocus(event: JQuery.FocusEvent) {
      const target = event.currentTarget
      setTimeout(() => {
        if (target && target == document.activeElement) {
          $(target).trigger('select')
        }
      }, 100)
    }

    _dragHandler(html: JQuery) {
      const dragHandler = (event: DragEvent) => this._onDragStart(event)
      html.find('.item[data-draggable="true"]').each((i, li) => {
        li.setAttribute('draggable', 'true') // this apparently requires a string, rather than a boolean
        li.addEventListener('dragstart', dragHandler, false)
      })
    }
  }
}

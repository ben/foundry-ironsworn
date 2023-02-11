import { App } from 'vue'
import {
  VueSheetRenderHelper,
  VueSheetRenderHelperOptions,
} from './vue-render-helper.js'

type Constructor<T = object> = abstract new (...args: any[]) => T

export function VueAppMixin<TBase extends Constructor<Application>>(
  Base: TBase
) {
  abstract class VueMixin extends Base {
    renderHelper: VueSheetRenderHelper | undefined

    static get defaultOptions(): ApplicationOptions {
      return mergeObject(
        // @ts-ignore TS complains about super not having defaultOptions here, but Application does have it -- just on the class, not the constructor.
        super.defaultOptions,
        {
          classes: ['ironsworn'],
          template: 'systems/foundry-ironsworn/templates/vue-app.hbs',
          submitOnClose: false,
          submitOnChange: false,
        }
      )
    }
    abstract get renderHelperOptions(): Partial<VueSheetRenderHelperOptions>

    setupVueApp(app: App): void {
      // Implement in descendants if needed
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
  return VueMixin
}

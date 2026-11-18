import type { App, Component, ComponentPublicInstance } from 'vue'
import { createApp } from 'vue'
import Mitt from 'mitt'
import type { LocalEmitter, LocalEmitterEvents } from './provisions.js'
import { $LocalEmitterKey } from './provisions.js'
import LoadingSpinner from './components/loading-spinner.vue'
import { IronswornSettings } from '../helpers/settings.js'
import { IronswornVuePlugin } from './vue-plugin.js'
import { pickBy } from 'lodash-es'

type Constructor<T = object> = abstract new (...args: any[]) => T

export interface VueApplicationOptions {
	rootComponent: Component
}

export function VueAppMixin<TBase extends Constructor>(Base: TBase) {
	const { HandlebarsApplicationMixin } = foundry.applications.api
	const HandlebarsBase = HandlebarsApplicationMixin(
		Base as unknown as AnyClassConstructor
	)
	abstract class VueMixin extends HandlebarsBase {
		vueApp: App<Element> | undefined
		vueRoot: ComponentPublicInstance | undefined
		vueListenersActive = false
		localEmitter: LocalEmitter = Mitt<LocalEmitterEvents>()

		static DEFAULT_OPTIONS: Record<string, any> = {
			classes: ['ironsworn'],
		}

		static PARTS = {
			app: {
				template: 'systems/foundry-ironsworn/templates/vue-app.hbs',
			},
		}

		setupVueApp(_app: App): void {
			// Implement in descendants if needed
		}

		async _prepareContext(_options?: object): Promise<object> {
			return (await super._prepareContext?.(_options)) ?? {}
		}

		async _getVueData(): Promise<object> {
			return {}
		}

		// Prevent Handlebars from replacing the DOM on re-renders once Vue is mounted.
		// Without this, every actor update destroys the Vue app's DOM nodes.
		_replaceHTML(result: object, content: HTMLElement, options: object): void {
			if (this.vueApp != null) return
			super._replaceHTML?.(result, content, options)
		}

		async _onRender(context: object, options: object): Promise<void> {
			await super._onRender?.(context, options)

			const element = this.element as HTMLElement

			if (this.vueApp != null && this.vueRoot != null) {
				// Already mounted — update reactive data
				const data = await this._getVueData()
				;(this.vueRoot as any).updateData(data)
				if (!this.vueListenersActive) {
					setTimeout(() => this._activateVueListeners(element, true), 150)
				}
				return
			}

			const data = await this._getVueData()
			const vueOptions = this.options as unknown as VueApplicationOptions
			const provides = pickBy(data, (_v, k) => k.startsWith('$'))
			this.localEmitter.on('closeApp', () => (this as any).close())

			this.vueRoot = undefined
			this.vueApp = createApp({
				components: {
					'loading-spinner': LoadingSpinner,
					'root-component': vueOptions.rootComponent,
				},
				data() {
					return { data }
				},
				provide: {
					context: {
						options: this.options,
						themeClass: IronswornSettings.classes.join(' '),
						config: CONFIG.IRONSWORN,
					},
					[$LocalEmitterKey as symbol]: this.localEmitter,
					...provides,
				},
				methods: {
					updateData(newCtx: object) {
						for (const k of Object.keys((this as any).data)) {
							;(this as any).data[k] = (newCtx as any)[k]
						}
					},
				},
			})
			this.vueApp.use(IronswornVuePlugin)
			this.setupVueApp(this.vueApp)

			const vuerootEl = element.querySelector('.vueroot')
			if (vuerootEl != null) {
				// .vueroot is a <form> nested in the AppV2 <form>; browsers don't bubble
				// its submit to the outer form, so Enter would trigger a native page load.
				vuerootEl.addEventListener('submit', (event) => {
					event.preventDefault()
				})
				this.vueRoot = this.vueApp.mount(vuerootEl as Element)
				setTimeout(() => this._activateVueListeners(element, true), 150)
			}
		}

		_onClose(options: object): void {
			super._onClose?.(options)
			this.vueApp?.unmount()
			this.vueApp = undefined
			this.vueRoot = undefined
		}

		/**
		 * Activate additional listeners on the rendered Vue app.
		 */
		_activateVueListeners(element: HTMLElement, repeat = false) {
			this._dragHandler(element)

			// Place one-time executions after this line.
			if (repeat) return

			const inputs =
				'.section input[type="text"], .section input[type="number"]'
			element.querySelectorAll<HTMLInputElement>(inputs).forEach((el) => {
				el.addEventListener('focus', (event) => this._onFocus(event))
			})
		}

		_onFocus(event: FocusEvent) {
			const target = event.currentTarget as HTMLInputElement | null
			setTimeout(() => {
				if (target && target === document.activeElement) target.select()
			}, 100)
		}

		_dragHandler(element: HTMLElement) {
			const dragHandler = (event: DragEvent) =>
				(this as any)._onDragStart(event)
			element
				.querySelectorAll<HTMLElement>('.item[data-draggable="true"]')
				.forEach((li) => {
					li.setAttribute('draggable', 'true')
					li.addEventListener('dragstart', dragHandler, false)
				})
		}
	}
	return VueMixin
}

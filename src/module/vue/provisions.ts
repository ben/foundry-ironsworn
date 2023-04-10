import type { InjectionKey, Ref } from 'vue'
import type { enrichHtml, enrichMarkdown } from './vue-plugin'
import type { IronswornActor } from '../actor/actor'
import type { IronswornItem } from '../item/item'
import type { Emitter, EventType } from 'mitt'
import type { IronswornJournalPage } from '../journal/journal-entry-page'

// Provided by the Vue plugin
export const $EnrichHtmlKey = Symbol('$enrichHtml') as InjectionKey<
	typeof enrichHtml
>
export const $EnrichMarkdownKey = Symbol('$enrichMarkdown') as InjectionKey<
	typeof enrichMarkdown
>

// Provided by the render helper
export interface LocalEmitterEvents extends Record<EventType, unknown> {
	closeApp: void
	activateTab: string
}
export type LocalEmitter = Emitter<LocalEmitterEvents>
export const $LocalEmitterKey = Symbol(
	'$localEmitter'
) as InjectionKey<LocalEmitter>

// Sheets have to provide these
export const $ActorKey = Symbol('$actor') as InjectionKey<IronswornActor>
export const ActorKey = Symbol('actor') as InjectionKey<
	Ref<ReturnType<typeof IronswornActor.prototype.toObject>>
>

export const $ItemKey = Symbol('$item') as InjectionKey<IronswornItem>
export const ItemKey = Symbol('item') as InjectionKey<
	Ref<ReturnType<typeof IronswornItem.prototype.toObject>>
>

export const $PageKey = Symbol('$page') as InjectionKey<IronswornJournalPage>
export const PageKey = Symbol('page') as InjectionKey<
	Ref<ReturnType<typeof IronswornJournalPage.prototype.toObject>>
>

import { InjectionKey, Ref } from 'vue'
import { enrichHtml, enrichMarkdown } from './vue-plugin'
import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'

// Provided by the Vue plugin
export const $EnrichHtmlKey = Symbol('$enrichHtml') as InjectionKey<
  typeof enrichHtml
>
export const $EnrichMarkdownKey = Symbol('$enrichMarkdown') as InjectionKey<
  typeof enrichMarkdown
>

// Sheets have to provide these
export const $ActorKey = Symbol('$actor') as InjectionKey<IronswornActor>
export const ActorKey = Symbol('actor') as InjectionKey<
  Ref<ReturnType<typeof IronswornActor.prototype.toObject>>
>

export const $ItemKey = Symbol('$item') as InjectionKey<IronswornItem>
export const ItemKey = Symbol('item') as InjectionKey<
  Ref<ReturnType<typeof IronswornItem.prototype.toObject>>
>

export const $PageKey = Symbol('$page') as InjectionKey<JourlEntryPage>

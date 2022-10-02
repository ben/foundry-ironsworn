import { InjectionKey } from 'vue'
import { enrichHtml, enrichMarkdown } from './vue-plugin'
import { IronswornActor } from '../actor/actor'
import { IronswornItem } from '../item/item'
import { IronswornEmitter } from '../../config'

// Provided by the Vue plugin
export const $EnrichHtmlKey = Symbol('$enrichHtml') as InjectionKey<
  typeof enrichHtml
>
export const $EnrichMarkdownKey = Symbol('$enrichMarkdown') as InjectionKey<
  typeof enrichMarkdown
>

export const $EmitterKey = Symbol('$emitter') as InjectionKey<IronswornEmitter>

// Sheets have to provide these
export const $ActorKey = Symbol('$actor') as InjectionKey<IronswornActor>
export const ActorKey = Symbol('actor') as InjectionKey<
  ReturnType<typeof IronswornActor.prototype.toObject>
>

export const $ItemKey = Symbol('$item') as InjectionKey<IronswornItem>

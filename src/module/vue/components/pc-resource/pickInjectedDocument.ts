import type { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import type { Ref } from 'vue'
import { inject } from 'vue'
import type { IronswornActor } from '../../actor/actor.js'
import type { IronswornItem } from '../../item/item.js'
import { $ActorKey, $ItemKey } from '../provisions.js'

/**
 * Selects the injected document of the appropriate type.
 * @param documentType The type of injected document to use.
 */
export function pickInjectedDocument<T extends DocumentType>(documentType: T) {
  let document: Ref<IronswornActor> | Ref<IronswornItem>
  let $document: IronswornActor | IronswornItem | undefined
  switch (documentType) {
    case 'Actor': {
      document = inject('actor') as Ref<IronswornActor>
      $document = inject($ActorKey)
      break
    }
    case 'Item': {
      document = inject('item') as Ref<IronswornItem>
      $document = inject($ItemKey)
      break
    }
    default:
      throw new Error('Only Actor and Item documents are supported.')
  }
  return { document, $document }
}

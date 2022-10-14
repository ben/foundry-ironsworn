import type { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { inject } from 'vue'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../provisions.js'

/**
 * Selects the injected document of the appropriate type.
 * @param documentType The type of injected document to use.
 */
export function pickInjectedDocument<T extends DocumentType>(documentType: T) {
  switch (documentType) {
    case 'Actor': {
      return { document: inject(ActorKey), $document: inject($ActorKey) }
    }
    case 'Item': {
      return { document: inject(ItemKey), $document: inject($ItemKey) }
    }
    default:
      throw new Error('Only Actor and Item documents are supported.')
  }
}

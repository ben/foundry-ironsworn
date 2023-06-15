import type { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import { ActorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/module.mjs'

declare global {
	export namespace foundry {
		export namespace documents {
			export interface Actor {
				effects: Collection<foundry.documents.BaseActiveEffect>
				statuses: Set<string>
				_onCreate(
					data: ActorSource,
					options: DocumentModificationOptions,
					userId: string
				): void
			}
		}
	}
}

export {}

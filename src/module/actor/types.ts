declare global {
	export namespace foundry {
		export namespace documents {
			export interface Actor {
				effects: Collection<foundry.documents.BaseActiveEffect>
				statuses: Set<string>
			}
		}
	}
}

export {}

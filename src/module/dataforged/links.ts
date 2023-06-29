function getCanonicalUUID(id: string, packIndices: CompendiumIndex[]) {
	for (const index of packIndices) {
		const entry = index.get(id)
		if (entry == null) continue
		else return entry.uuid
	}
	throw new Error(`Couldn't find a pack entry with the key ${id}`)
}

/**
 *
 * @param str The string field value.
 * @param packIndices The "canonical" pack indices to use for local ID lookup.
 */
export function migrateLinksInString(
	str: string,
	packIndices: CompendiumIndex[]
) {
	const legacyLinkPointerPattern =
		/@Compendium\[[A-Za-z0-9-_]+?\.[A-Za-z0-9-_]+?\.(?<id>[a-zA-Z0-9]{16})\]/g

	return str.replaceAll(
		legacyLinkPointerPattern,
		(_match, _p1, _offset, _string, groups: { id: string }) => {
			// get the local ID from the link
			const { id } = groups
			// search pack indices for entries keyed with the local id
			const targetUUID = getCanonicalUUID(id, packIndices)
			return `@UUID[${targetUUID}]`
		}
	)
}

/**
 * Iterates over the HTML fields of a document, and applies a transform to each field's string value.
 * @param document The document whose HTMLFields will be updated.
 * @param transform The function to apply to each HTML field's value.
 * @returns A document update delta, suitable for use with {@link foundry.abstract.Document.updateDocuments}
 */
export function migrateHTMLFields<
	T extends foundry.abstract.Document<any, any, any>
>(document: T, transform: (str: string) => string) {
	const schema = (
		document as unknown as foundry.abstract.DataModel<any, any, any>
	).schema

	function updateLinks(this: foundry.data.fields.DataField, value: unknown) {
		if (
			this instanceof foundry.data.fields.HTMLField &&
			typeof value === 'string'
		)
			return transform(value)
		return undefined
	}

	const updateData = schema.apply(updateLinks, document as any) as Partial<T>

	if (foundry.utils.isEmpty(updateData)) return null

	return { _id: document.id, ...updateData }
}

async function loadReferencePackIndices(...referencePackIDs: string[]) {
	const packIndices: CompendiumIndex[] = []
	for await (const id of referencePackIDs) {
		const refPack = game.packs.get(id)
		if (refPack == null) throw new Error(`Could not find pack ${id}`)
		if (!refPack.indexed) await refPack.getIndex()
		packIndices.push(refPack.index as unknown as CompendiumIndex)
	}
	return packIndices
}

/**
 *
 * @param packID The ID of the pack to update.
 * @param referencePackIDs The packs to reference for canonical UUIDs when updating the links. (default: all)
 * @param dryRun When true, don't update the documents; instead, return the raw document update deltas.
 */
export async function updatePackDocumentLinks(
	packID: string,
	referencePackIDs: string[] = Array.from(game?.packs?.keys()) ?? [],
	{ dryRun = false }: { dryRun: boolean }
) {
	if (!game.user!.isGM)
		return ui.notifications?.warn(
			'You must be GM to run updatePackDocumentLinks'
		)

	const pack = game.packs.get(packID)
	if (pack == null) throw new Error(`Could not find pack ${packID}`)

	// load packs to be used for reference and make sure they're indexed
	const [packIndices, docs] = await Promise.all([
		loadReferencePackIndices(...referencePackIDs),
		pack.getDocuments()
	])
	const updates: any[] = []

	// begin constructing update deltas for each document
	for (const doc of docs) {
		const updateDelta = migrateHTMLFields(doc, (str: string) =>
			migrateLinksInString(str, packIndices)
		)
		if (updateDelta != null) updates.push(updateDelta)
	}

	if (updates.length === 0) return

	if (dryRun) return updates

	const cls = pack.documentClass as typeof foundry.abstract.Document

	return await cls.updateDocuments(updates, {
		pack: packID
	})
}

export async function updateWorldDocumentLinks() {
	const { actors, items, journal } = game
}

type CompendiumIndex = Collection<{
	id: string
	uuid: string
	name: string
	img: string
}>

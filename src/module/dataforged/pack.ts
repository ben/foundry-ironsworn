import {
	ConstructorDataType,
	DocumentConstructor
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

export async function emptyPack<
	TPack extends CompendiumCollection<CompendiumCollection.Metadata>
>(pack: TPack): Promise<TPack> {
	const index = await pack.getIndex()
	const keys = Array.from(index.keys())
	await pack.documentClass.deleteDocuments(keys, {
		pack: pack.collection
	})
	return pack
}

export async function deleteBy<
	TPack extends CompendiumCollection<CompendiumCollection.Metadata>
>(pack: TPack, test: (obj: InstanceType<TPack['documentClass']>) => boolean) {
	for await (const entry of pack) {
		if (test(entry as InstanceType<TPack['documentClass']>)) continue
		await entry.delete()
	}
}

export async function deleteEmptyPackFolders<
	TPack extends CompendiumCollection<CompendiumCollection.Metadata>
>(pack: TPack) {
	const emptyFolders = (
		(pack as any).folders as CompendiumFolderCollection
	)?.filter((obj) => {
		const hasDocumentChildren = obj.contents.length > 0
		const hasDocumentDescendants =
			obj.getSubfolders(true).flatMap((subfolder) => subfolder.contents)
				.length > 0
		return !hasDocumentChildren && !hasDocumentDescendants
	})
	for await (const emptyFolder of emptyFolders) {
		await emptyFolder.delete()
	}
	return pack
}

export async function rebuildPack<
	TPack extends CompendiumCollection<CompendiumCollection.Metadata>,
	TPackDocument extends InstanceType<TPack['documentClass']>,
	TData
>(
	pack: TPack,
	data: TData[],
	transform: (data: TData) => ConstructorDataType<TPackDocument['data']>
) {
	await pack.configure({ locked: false })
	await emptyPack(pack)

	const options: DocumentModificationContext = {
		// @ts-expect-error v10+ uses this instead of clearPermissions
		clearOwnership: true,
		keepId: true,
		clearSort: false,
		clearState: true,
		clearFlags: false
	}

	// @ts-expect-error This is a sound typing, but TS doesn't think so.
	await pack.documentClass.createDocuments<TPack['documentClass']>(
		data.map((datum) => transform(datum)),
		options
	)

	await pack.configure({ locked: true })
}

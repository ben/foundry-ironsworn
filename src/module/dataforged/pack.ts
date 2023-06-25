import type { DocumentDataType } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import type { FolderDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/folderData'
import type {
	ConfiguredDocumentClassForName,
	ConstructorDataType
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type { PackableDocument } from '../folder/folder-types'
import { hash } from './import'

interface DataforgedPackData<T extends PackableDocument> {
	folders: FolderDataConstructorData[]
	contents: ConstructorDataType<DocumentDataType<T>>[]
}

/**
 * Dialog for operations common to importing Dataforged v1 from Dataforged
 * @param type The canonical name of the document type to be created.
 * @param packId The ID of the pack whose contents are to be replaced.
 * @param transform A function that parses the raw JSON string into constructor data for folders and compendium contents.
 * @remarks Based on ClientDocumentMixin#importFromJSONDialog
 */
export async function importFromDataforgedDialog<
	T extends foundry.CONST.COMPENDIUM_DOCUMENT_TYPES
>(
	type: T,
	packId: string,
	transform: (
		json: string,
		pack: CompendiumCollection<CompendiumCollection.Metadata & { type: T }>
	) => Promise<
		DataforgedPackData<InstanceType<ConfiguredDocumentClassForName<T>>>
	>
) {
	new Dialog(
		{
			title: `Import Dataforged v1 as ${type}s`,
			content: await renderTemplate('templates/apps/import-data.html', {
				hint1: `Choose a JSON file containing Dataforged v1 data to be converted into ${type}s`,
				hint2: `This will <strong>completely replace</strong> the contents of the pack: ${packId}`
			}),
			buttons: {
				import: {
					icon: '<i class="fas fa-file-import"></i>',
					label: 'Import',
					callback: async (html) => {
						const form = (html as JQuery<HTMLElement>).find('form')[0]
						if (!form.data.files.length) {
							ui.notifications?.error('You did not upload a data file!')
							return
						}

						const pack = game.packs.get(packId) as CompendiumCollection<
							CompendiumCollection.Metadata & { type: T }
						>
						if (pack == null)
							return ui.notifications?.error(
								`Could not find a pack with the ID ${packId}`
							)
						if (pack.metadata.type !== type)
							return ui.notifications?.error(
								`Expected pack with the type ${type}, but ${packId} has the type ${pack.metadata.type}`
							)

						const json = await readTextFromFile(form.data.files[0])

						// @ts-expect-error
						await pack.configure({ locked: false, sorting: 'm' })

						const ctorData = await transform(json, pack)

						await emptyPack(pack)

						const folders = await getDocumentClass('Folder').createDocuments(
							ctorData.folders,
							{
								// @ts-expect-error
								pack: pack.metadata.id,
								keepEmbeddedIds: true,
								keepId: true
							}
						)

						const contents = (await getDocumentClass(type)
							// @ts-expect-error
							.createDocuments(ctorData.contents, {
								// @ts-expect-error
								pack: pack.metadata.id,
								keepEmbeddedIds: true,
								keepId: true
							})) as InstanceType<ConfiguredDocumentClassForName<T>>[]

						if (
							folders.length > 0 &&
							contents.some((item) => 'parentDfid' in item)
						)
							for await (const entry of contents) {
								await entry.update({
									folder: hash((entry as { parentDfid: string }).parentDfid)
								})
							}
						// clean up any empty folders
						await deleteEmptyPackFolders(pack)
						// all done -- lock the pack again
						await pack.configure({ locked: true })
					}
				},
				no: {
					icon: '<i class="fas fa-times"></i>',
					label: 'Cancel'
				}
			},
			default: 'import'
		},
		{
			width: 400
		}
	).render(true)
}

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

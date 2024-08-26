import type { Asset, AssetCollection } from '@datasworn/core/dist/Datasworn'
import { compact } from 'lodash-es'
import {
	COMPENDIUM_KEY_MAP,
	DataswornTree,
	getPackAndIndexForCompendiumKey,
	IdParser
} from '../datasworn2'
import { IronswornSettings } from '../helpers/settings'
import type { IronswornItem } from '../item/item'

export interface DisplayAsset {
	ds?: Asset
	assetFetcher: () => Promise<IronswornItem>
}

export interface DisplayCategory {
	ds?: AssetCollection
	title: string
	description?: string
	expanded: boolean
	assets: DisplayAsset[]
}

export interface DisplayRuleset {
	title: string
	categories: DisplayCategory[]
	index?: ReturnType<(typeof CompendiumCollection.prototype)['getIndex']>
}

const INDEXES: Record<string, any> = {}

function assetFetcher(dsid: string): () => Promise<IronswornItem> {
	const parsed = IdParser.parse(dsid)
	const compendiumKey = COMPENDIUM_KEY_MAP.asset[parsed.rulesPackageId]
	const pack = game.packs.get(compendiumKey)
	return async () => {
		INDEXES[compendiumKey] ||= await pack?.getIndex({ fields: ['flags'] })
		const indexEntry = INDEXES[compendiumKey]?.contents?.find(
			(x) => x.flags['foundry-ironsworn']?.dsid === dsid
		)
		return (await pack?.getDocument(indexEntry?._id ?? '')) as IronswornItem
	}
}

export async function createMergedAssetTree(): Promise<DisplayRuleset[]> {
	let ret: DisplayRuleset[] = compact(
		await Promise.all(
			IronswornSettings.enabledRulesets.map(async (rsKey) => {
				const rs = DataswornTree.get(rsKey)
				if (!rs) return undefined

				const rsTitle = rsKey.titleCase()
				const i18n = (categoryName: string, subKey: string) => {
					const capCat = categoryName.titleCase()
					return game.i18n.localize(
						`IRONSWORN.Asset Categories.${rsTitle}.${capCat}.${subKey}`
					)
				}

				const { index } = await getPackAndIndexForCompendiumKey(rsKey, 'asset')

				return {
					title: game.i18n.localize(`IRONSWORN.RULESETS.${rsKey}`),
					index,
					categories: Object.values(rs.assets).map((cat) => {
						return {
							ds: cat,
							title: i18n(cat.name, 'Title'),
							description: i18n(cat.name, 'Description'),
							expanded: false,
							assets: Object.values(cat.contents).map((asset) => ({
								ds: asset,
								assetFetcher: assetFetcher(asset._id)
							}))
						}
					})
				}
			})
		)
	)

	// Remove rulesets with no assets
	ret = ret.filter((rs) => rs.categories.length > 0)

	// Add custom assets from well-known folder
	const customAssets = await customAssetFolderContents()
	if (customAssets)
		ret.push({
			title: game.i18n.localize('IRONSWORN.Asset Categories.Custom'),
			categories: [customAssets]
		})

	// fire the hook and allow extensions to modify the list
	for (const rs of ret) {
		Hooks.call('ironswornAssets', rs)
	}

	return ret
}

async function customAssetFolderContents(): Promise<
	DisplayCategory | undefined
> {
	const name = game.i18n.localize('IRONSWORN.Asset Categories.Custom')
	const folder = (game.items?.directory as any)?.folders.find(
		(x) => x.name === name
	) as Folder | undefined
	if (folder == null || folder.contents.length == 0) return

	const customAssets = [] as DisplayAsset[]
	for (const item of folder.contents) {
		if (item.documentName !== 'Item' || item.type !== 'asset') continue
		customAssets.push({ assetFetcher: async () => item })
	}

	return {
		title: name,
		expanded: false,
		assets: customAssets
	}
}

import type { Asset, AssetCollection } from '@datasworn/core/dist/Datasworn'
import type { IAsset, IAssetType } from 'dataforged'
import { compact } from 'lodash-es'
import { renderLinksInStr, hashLookup } from '../dataforged'
import { ISAssetTypes, SFAssetTypes } from '../dataforged/data'
import { DataswornTree, IdParser } from '../datasworn2'
import { IronswornSettings } from '../helpers/settings'
import type { IronswornItem } from '../item/item'

export const DS_ASSET_COMPENDIUM_KEYS: Record<string, string> = {
	classic: 'foundry-ironsworn.ironswornassets',
	starforged: 'foundry-ironsworn.starforgedassets',
	sundered_isles: 'foundry-ironsworn.sunderedislesassets'
}

export interface DisplayAsset {
	df?: IAsset
	ds?: Asset
	assetFetcher: () => Promise<IronswornItem>
}

export interface DisplayCategory {
	df?: IAssetType
	ds?: AssetCollection
	title: string
	description?: string
	expanded: boolean
	assets: DisplayAsset[]
}

export interface DisplayRuleset {
	title: string
	categories: DisplayCategory[]
}

export async function createIronswornAssetTree(): Promise<DisplayCategory[]> {
	return await createAssetTree(
		'foundry-ironsworn.ironswornassets',
		'Ironsworn',
		ISAssetTypes
	)
}
export async function createStarforgedAssetTree(): Promise<DisplayCategory[]> {
	return await createAssetTree(
		'foundry-ironsworn.starforgedassets',
		'Starforged',
		SFAssetTypes
	)
}

const INDEXES: Record<string, any> = {}

function assetFetcher(dsid: string): () => Promise<IronswornItem> {
	const parsed = IdParser.parse(dsid)
	const compendiumKey = DS_ASSET_COMPENDIUM_KEYS[parsed.rulesPackageId]
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
			IronswornSettings.enabledRulesets.map(async (rsName) => {
				const rs = DataswornTree.get(rsName)
				if (!rs) return undefined
				return {
					title: rs.title,
					categories: Object.values(rs.assets).map((cat) => {
						return {
							ds: cat,
							title: cat.name, // TODO: i18n
							description: cat.description ?? '', // TODO: i18n, maybe use compendium folder description
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

async function createAssetTree(
	compendiumName: string,
	i18nkeyslug: string,
	assetTypes: IAssetType[]
): Promise<DisplayCategory[]> {
	// Load from compendium
	const ret = await compendiumAssets(compendiumName, i18nkeyslug, assetTypes)

	// Add custom omves from well-known folder
	await augmentWithFolderContents(ret)

	// fire the hook and allow extensions to modify the list
	await Hooks.call('ironswornAssets', ret)

	return ret
}

async function compendiumAssets(
	compendiumName: string,
	i18nkeyslug: string,
	assetTypes: IAssetType[]
): Promise<DisplayCategory[]> {
	const pack = game.packs.get(compendiumName)
	if (pack == null) throw new Error(`can't load pack ${compendiumName}`)

	const i18n = (categoryName: string, extension: string) => {
		const capCat = categoryName.capitalize()
		return game.i18n.localize(
			`IRONSWORN.Asset Categories.${i18nkeyslug}.${capCat}.${extension}`
		)
	}

	const categories = [] as DisplayCategory[]
	for (const dfAssetType of assetTypes) {
		const i18nDescription = i18n(dfAssetType.Name, 'Description')
		const cat: DisplayCategory = {
			df: dfAssetType,
			title: i18n(dfAssetType.Name, 'Title'),
			description: renderLinksInStr(i18nDescription),
			expanded: false,
			assets: []
		}

		for (const dfAsset of dfAssetType.Assets) {
			const item = (await pack.getDocument(
				hashLookup(dfAsset.$id)
			)) as IronswornItem
			cat.assets.push({
				df: dfAsset,
				assetFetcher: () => item
			})
		}

		categories.push(cat)
	}

	return categories
}

async function augmentWithFolderContents(categories: DisplayCategory[]) {
	const name = game.i18n.localize('IRONSWORN.Asset Categories.Custom')
	const folder = (game.items?.directory as any)?.folders.find(
		(x) => x.name === name
	) as Folder | undefined
	if (folder == null || folder.contents.length == 0) return

	const customAssets = [] as DisplayAsset[]
	for (const item of folder.contents) {
		if (item.documentName !== 'Item' || item.type !== 'asset') continue
		customAssets.push({ assetFetcher: () => item })
	}

	categories.push({
		title: name,
		expanded: false,
		assets: customAssets
	})
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
		customAssets.push({ assetFetcher: () => item })
	}

	return {
		title: name,
		expanded: false,
		assets: customAssets
	}
}

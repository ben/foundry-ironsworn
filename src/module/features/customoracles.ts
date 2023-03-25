import type {
	IOracle,
	IOracleCategory,
	Starforged,
	Ironsworn
} from 'dataforged'
import { starforged, ironsworn } from 'dataforged'
import { cloneDeep, compact } from 'lodash-es'
import { getFoundryTableByDfId } from '../dataforged'
import { cachedDocumentsForPack } from './pack-cache'

export interface IOracleTreeNode {
	dataforgedNode?: IOracle | IOracleCategory
	tables: string[] // UUIDs
	displayName: string
	children: IOracleTreeNode[]
	forceExpanded?: boolean
	forceHidden?: boolean
}

// For some reason, rollupJs mangles this
const SFOracleCategories = ((starforged as any).default as Starforged)[
	'Oracle Categories'
]
const ISOracleCategories = ((ironsworn as any).default as Ironsworn)[
	'Oracle Categories'
]

const emptyNode: () => IOracleTreeNode = () => ({
	displayName: '',
	tables: [],
	children: []
})

async function createOracleTree(
	compendium: string,
	categories: IOracleCategory[]
): Promise<IOracleTreeNode> {
	const rootNode = emptyNode()

	// Make sure the compendium is loaded
	await cachedDocumentsForPack(compendium)

	// Build the default tree
	for (const category of categories) {
		rootNode.children.push(await walkOracleCategory(category))
	}

	// Add in custom oracles from a well-known directory
	await augmentWithFolderContents(rootNode)

	// Fire the hook and allow extensions to modify the tree
	// TODO: deprecate this, warning if something is registered
	Hooks.call('ironswornOracles', rootNode)

	return rootNode
}

async function createIronswornOracleTree(): Promise<IOracleTreeNode> {
	return await createOracleTree(
		'foundry-ironsworn.ironswornoracles',
		ISOracleCategories
	)
}

async function createStarforgedOracleTree(): Promise<IOracleTreeNode> {
	return await createOracleTree(
		'foundry-ironsworn.starforgedoracles',
		SFOracleCategories
	)
}

async function walkOracleCategory(
	cat: IOracleCategory
): Promise<IOracleTreeNode> {
	const node: IOracleTreeNode = {
		...emptyNode(),
		dataforgedNode: cat,
		displayName: game.i18n.localize(`IRONSWORN.OracleCategories.${cat.Name}`)
	}

	for (const childCat of cat.Categories ?? []) {
		node.children.push(await walkOracleCategory(childCat))
	}
	for (const oracle of cat.Oracles ?? []) {
		node.children.push(await walkOracle(oracle))
	}

	// Promote children of nodes that have a table
	for (const child of node.children) {
		if (child.tables.length > 0) {
			node.children = [...node.children, ...child.children]
			child.children = []
		}
	}

	return node
}

export async function walkOracle(
	oracle?: IOracle | IOracleCategory
): Promise<IOracleTreeNode> {
	if (oracle == null) return emptyNode()

	const table = await getFoundryTableByDfId(oracle.$id)

	const node: IOracleTreeNode = {
		...emptyNode(),
		dataforgedNode: oracle,
		tables: compact([table?.uuid]),
		displayName:
			table?.name ??
			game.i18n.localize(`IRONSWORN.OracleCategories.${oracle.Name}`)
	}

	// Child oracles
	for (const childOracle of oracle.Oracles ?? []) {
		node.children.push(await walkOracle(childOracle))
	}

	// Subtables on results
	for (const entry of oracle.Table ?? []) {
		const name = entry.Result
		if (entry.Subtable != null) {
			const subtable = await getFoundryTableByDfId(`${oracle.$id}/${name}`)
			if (subtable != null) {
				node.children.push({
					...emptyNode(),
					displayName: name,
					tables: [subtable.uuid]
				})
			}
		}
	}

	// Promote children of nodes that have a table
	for (const child of node.children) {
		if (child.tables.length > 0) {
			node.children = [...node.children, ...child.children]
			child.children = []
		}
	}

	return node
}

async function augmentWithFolderContents(node: IOracleTreeNode) {
	const name = game.i18n.localize('IRONSWORN.OracleCategories.Custom')
	const rootFolder = game.tables?.directory?.folders.find(
		(x) => x.name === name
	)
	if (rootFolder == null) return

	function walkFolder(parent: IOracleTreeNode, folder: Folder) {
		// Add this folder
		const newNode: IOracleTreeNode = {
			...emptyNode(),
			displayName: folder.name ?? '(folder)'
		}
		parent.children.push(newNode)

		// Add its folder children
		for (const sub of folder.getSubfolders()) {
			walkFolder(newNode, sub)
		}

		// Add its table children
		for (const table of folder.contents) {
			newNode.children.push({
				...emptyNode(),
				tables: [table.uuid],
				displayName: table.name ?? '(table)'
			})
		}
	}

	walkFolder(node, rootFolder)
}

export function findPathToNodeByTableUuid(
	rootNode: IOracleTreeNode,
	tableUuid: string
): IOracleTreeNode[] {
	const ret: IOracleTreeNode[] = []
	function walk(node: IOracleTreeNode) {
		ret.push(node)
		const foundTable = node.tables.find((x) => x === tableUuid)
		if (foundTable != null) return true
		for (const child of node.children) {
			if (walk(child)) return true
		}
		ret.pop()
		return false
	}

	walk(rootNode)
	return ret
}

export function findPathToNodeByDfId(rootNode: IOracleTreeNode, dfId: string) {
	const ret: IOracleTreeNode[] = []
	function walk(node: IOracleTreeNode) {
		ret.push(node)
		if (node.dataforgedNode?.$id === dfId) return true
		for (const child of node.children) {
			if (walk(child)) return true
		}
		ret.pop()
		return false
	}

	walk(rootNode)
	return ret
}

type OracleCategory = 'ironsworn' | 'starforged'

const ORACLES: Record<OracleCategory, IOracleTreeNode> = {
	ironsworn: emptyNode(),
	starforged: emptyNode()
}

export function registerOracleTreeInternal(
	category: OracleCategory,
	rootNode: IOracleTreeNode
) {
	ORACLES[category] = rootNode
}

let defaultTreesInitialized = false

export async function registerDefaultOracleTrees() {
	const ironswornOracles = await createIronswornOracleTree()
	registerOracleTreeInternal('ironsworn', ironswornOracles)

	const starforgedOracles = await createStarforgedOracleTree()
	registerOracleTreeInternal('starforged', starforgedOracles)

	defaultTreesInitialized = true
}

// Available in browser
export function registerOracleTree(
	category: OracleCategory,
	rootNode: IOracleTreeNode
) {
	// Check if internal registrations have been done
	// If not, do nothing and send a warning to the UI
	if (!defaultTreesInitialized) {
		const message =
			'Not ready yet. Call registerOracleTree from a "ready" hook please.'
		ui.notifications?.warn(message)
		throw new Error(message)
	}

	registerOracleTreeInternal(category, rootNode)
}

export function getOracleTree(category: OracleCategory): IOracleTreeNode {
	return cloneDeep(ORACLES[category])
}

import type {
	OracleCollection,
	OracleRollableTable,
	OracleTablesCollection,
	RulesetId
} from '@datasworn/core/dist/Datasworn'
import { cloneDeep, compact } from 'lodash-es'
import {
	DataswornTree,
	getPackAndIndexForCompendiumKey,
	IdParser
} from '../datasworn2'
import { DataswornRulesetKey, IronswornSettings } from '../helpers/settings'

export interface IOracleTreeNode {
	dataswornNode?: OracleCollection | OracleRollableTable
	dsIdentifier?: string // the last part of the dsid
	tables: string[] // UUIDs
	displayName: string
	children: IOracleTreeNode[]
	forceExpanded?: boolean
	forceHidden?: boolean
}

const emptyNode: () => IOracleTreeNode = () => ({
	displayName: '',
	tables: [],
	children: []
})

function customFolderOracleCategory(): [IOracleTreeNode, number] {
	const name = game.i18n.localize('IRONSWORN.OracleCategories.Custom')
	const ret = { ...emptyNode(), displayName: name }
	let count = 0

	const rootFolder = game.tables?.folders?.find((x) => x.name === name)
	if (rootFolder == null) return [ret, count]

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
			count++
			newNode.children.push({
				...emptyNode(),
				tables: [table.uuid],
				displayName: table.name ?? '(table)'
			})
		}
	}

	walkFolder(ret, rootFolder)
	return [ret.children[0], count]
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

const ORACLES: Record<string, IOracleTreeNode> = {}

export function registerOracleTreeInternal(
	category: DataswornRulesetKey,
	rootNode: IOracleTreeNode
) {
	ORACLES[category] = rootNode
}

let defaultTreesInitialized = false

function walkOracleTable(
	node: OracleRollableTable,
	index: any
): IOracleTreeNode {
	const tableIndexEntry = index.contents.find(
		(x) => x.flags?.['foundry-ironsworn']?.dsid === node._id
	)
	const rpid = IdParser.parse(node._id)
	const dsIdentifier = rpid.primaryPathKeys[rpid.primaryPathKeys.length - 1]
	return {
		dataswornNode: node,
		dsIdentifier,
		displayName: tableIndexEntry?.name ?? node.name,
		tables: compact([tableIndexEntry?.uuid]),
		children: []
	}
}

function walkDsOracleCollection(
	node: OracleTablesCollection,
	index: any
): IOracleTreeNode {
	const children = [
		...Object.values(node?.collections ?? {}).map((x) =>
			walkDsOracleCollection(x as OracleTablesCollection, index)
		),
		...Object.values(node?.contents ?? {}).map((x) => walkOracleTable(x, index))
	]
	const rpid = IdParser.parse(node._id)
	const dsIdentifier = rpid.primaryPathKeys[rpid.primaryPathKeys.length - 1]

	return {
		dataswornNode: node,
		dsIdentifier,
		displayName: game.i18n.localize(`IRONSWORN.OracleCategories.${node.name}`),
		tables: [],
		children
	}
}

async function generateTreeFromDsData(
	ruleset: RulesetId
): Promise<IOracleTreeNode> {
	const { index } = await getPackAndIndexForCompendiumKey(
		ruleset as DataswornRulesetKey,
		'oracle_rollable'
	)
	if (!index) return emptyNode()

	const rp = DataswornTree.get(ruleset)
	if (!rp) return emptyNode()
	return {
		displayName: game.i18n.localize(`IRONSWORN.RULESETS.${ruleset}`),
		dsIdentifier: ruleset,
		tables: [],
		children: Object.values(rp?.oracles ?? {}).map((o) =>
			walkDsOracleCollection(o, index)
		)
	}
}

export async function registerDefaultOracleTrees() {
	for (const ruleset of IronswornSettings.enabledRulesets) {
		const tree = await generateTreeFromDsData(ruleset)
		registerOracleTreeInternal(ruleset, tree)
	}

	defaultTreesInitialized = true
	Hooks.call('ironswornOracleTreesReady')
}

// Available in browser
export function registerOracleTree(
	category: DataswornRulesetKey,
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

export function getOracleTree(category: DataswornRulesetKey): IOracleTreeNode {
	return cloneDeep(ORACLES[category])
}

export async function getCustomizedOracleTrees(): Promise<IOracleTreeNode[]> {
	const [customNode, customOracleCount] = customFolderOracleCategory()

	return compact(
		await Promise.all([
			...Object.keys(ORACLES).map(async (ruleset) => {
				const tree = ORACLES[ruleset]

				// Fire the hook and allow extensions to modify the tree
				Hooks.call('ironswornOracles', tree)

				return tree
			}),
			customOracleCount > 0 ? customNode : null
		])
	)
}

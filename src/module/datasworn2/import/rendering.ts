import Showdown from 'showdown'
import { IdParser } from '..'
import { COMPENDIUM_KEY_MAP } from '../finding'
import { hash, lookupLegacyId } from './ids'

export const markdownRenderer = new Showdown.Converter({ tables: true })

const MARKDOWN_LINK_RE = /\[(.*?)\]\((.*?)\)/g

export function renderLinksInStr(str: string): string {
	return str.replace(MARKDOWN_LINK_RE, (match, text: string, url: string) => {
		if (!url.startsWith('datasworn:')) return match
		url = url.substring('datasworn:'.length)
		const parsed = IdParser.parse(url)

		// Strip links to NPC collections, Foundry has no support for them
		if (['npc_collection', 'atlas_entry'].includes(parsed.primaryTypeId)) {
			return text
		}

		// TODO: render move/oracle links as data-dfid anchors so they'll navigate properly

		// Fixup: embedded oracle tables will be imported as full RollTables
		// So here we redirect links to move-oracles to full oracles
		const typeId =
			parsed.typeIds.join('/') === 'move/oracle_rollable'
				? 'oracle_rollable'
				: parsed.primaryTypeId
		const compendiumKey = COMPENDIUM_KEY_MAP[typeId]?.[parsed.rulesPackageId]
		if (!compendiumKey) {
			console.log(
				`!!! No compendium key for ${match} (${typeId} / ${parsed.rulesPackageId})`,
				match
			)
			return match
		}

		const legacyId = lookupLegacyId(url)

		if (parsed.primaryTypeId === 'oracle_collection') {
			return `
<a class="entity-link oracle-category-link" data-dsid="${url}">
	<i class="fa fa-caret-right"></i> ${text}
</a>`
		}
		const urlHash = hash(legacyId)
		return `@Compendium[${compendiumKey}.${urlHash}]{${text}}`
	})
}

export function renderText(text: string): string {
	return markdownRenderer.makeHtml(renderLinksInStr(text))
}

export function titleCase(str: string): string {
	const skipWords = [
		'a',
		'an',
		'the',
		'and',
		'but',
		'or',
		'of',
		'for',
		'nor',
		'on',
		'at',
		'to',
		'from',
		'by',
		'with'
	]
	return str.replace(/[^\s/]+/g, (word) =>
		skipWords.includes(word) ? word : word[0].toUpperCase() + word.substring(1)
	)
}

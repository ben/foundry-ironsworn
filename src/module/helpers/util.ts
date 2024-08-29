import shajs from 'sha.js'
import type { Metadata } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import { DFKeysWithValuesOfType } from '../item/types'

/**
 * @remarks A document-subtype-sensitive replacement for the FVTT document deletion dialog.
 * @see {@link ClientDocumentMixin#deleteDialog}
 */
export async function typedDeleteDialog<
	T extends foundry.abstract.Document<any, any, Metadata<any>> & {
		type: string
	}
>(document: T, options: Partial<DialogOptions> = {}): Promise<T> {
	const docType = document.documentName as T['documentName'] &
		DFKeysWithValuesOfType<
			typeof CONFIG,
			{ typeLabels: Record<T['type'], string> }
		>
	const typeLabelKey = CONFIG[docType]?.typeLabels?.[document.type]

	if (typeLabelKey == null)
		// no available label key -- fall back to the standard dialog
		return (document as any).deleteDialog(options)

	const type = game.i18n.localize(typeLabelKey)

	return (await Dialog.confirm({
		title: `${game.i18n.format('DOCUMENT.Delete', { type })}: ${
			document.name as string
		}`,
		content: `<h4>${game.i18n.localize('AreYouSure')}</h4><p>${game.i18n.format(
			'SIDEBAR.DeleteWarning',
			{ type }
		)}</p>`,
		yes: document.delete.bind(document) as any,
		options
	})) as any
}

const HASH_CACHE = {} as Record<string, string>
export function hashLookup(str: string): string {
	HASH_CACHE[str] ||= hash(str)
	return HASH_CACHE[str]
}

export function hash(str: string): string {
	return shajs('sha256').update(str).digest('hex').substring(48)
}

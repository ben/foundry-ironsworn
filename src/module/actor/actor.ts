import type { StatusEffect } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/token'
import type EmbeddedCollection from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/embedded-collection.mjs'
import type {
	ActorData,
	ActorDataConstructorData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData'
import type { ConfiguredData } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import type {
	ConfiguredDocumentClass,
	DocumentConstructor,
	DocumentSubTypes
} from '../../types/helperTypes'
import { IronActiveEffect } from '../active-effect/active-effect'
import { CreateActorDialog } from '../applications/createActorDialog'
import { IronswornSettings } from '../helpers/settings'
import type { IronswornItem } from '../item/item'
import type { ActorDataProperties, ActorDataSource } from './config'
import type { SFCharacterMoveSheet } from './sheets/sf-charactermovesheet'

let CREATE_DIALOG: CreateActorDialog

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 */
export class IronswornActor<
	T extends DocumentSubTypes<'Actor'> = any
> extends Actor {
	// Type hack for v10 compatibility updates
	declare system: Extract<ActorDataProperties, { type: T }>['system']
	// @ts-expect-error
	declare type: T

	moveSheet?: SFCharacterMoveSheet

	override get itemTypes() {
		return super.itemTypes as Actor['itemTypes'] & {
			[K in DocumentSubTypes<'Item'>]: Array<IronswornItem<K>>
		}
	}

	/** The impacts valid to toggled from this actor's token. */
	get tokenImpacts() {
		return this.validImpacts
		// FIXME: ideally this would include custom impacts, too, but there's some difficulties with toggling them on/off cleanly.
		// return [...this.validImpacts, ...this.customImpacts]
	}

	/** The common status effects that are valid for this actor type */
	get validImpacts() {
		return IronActiveEffect.statusEffects[this.impactSet].filter(
			this.system.isValidImpact
		)
	}

	/** A convenience getter that returns all custom impacts on the PC. */
	get customImpacts() {
		return this.effects.filter(
			(ae: IronActiveEffect) => ae.isCustomImpact
		) as IronActiveEffect[]
	}

	get impactSet(): 'starforged' | 'classic' {
		const override = this.getFlag('foundry-ironsworn', 'impacts')
		if (override != null) return override

		if (this.isStarforgedOnlySheet) return 'starforged'
		if (this.isClassicOnlySheet) return 'classic'

		return IronswornSettings.impactSetDefault
	}

	get impactType() {
		switch (this.impactSet) {
			case 'starforged':
				return 'impact'
			case 'classic':
			default:
				return 'debility'
		}
	}

	/**
	 * A helper function to toggle a status effect which includes an Active Effect template
	 * @param effectData The Active Effect data, or the status ID of an effect.
	 * @param overlay Should the Active Effect icon be displayed as an overlay on the token?
	 * @param active Force a certain active state for the effect.
	 * @returns Whether the Active Effect is now on or off
	 */
	async toggleActiveEffect(
		effect: StatusEffectV11 | string,
		{ overlay = false, active }: { overlay?: boolean; active?: boolean } = {}
	): Promise<boolean> {
		const effectData =
			typeof effect === 'string'
				? [...this.validImpacts, ...this.customImpacts].find((ae) =>
						ae.statuses instanceof Set
							? ae.statuses?.has(effect)
							: ae.statuses?.includes(effect) ?? ae.id === effect
				  )
				: effect

		if (effectData?.id == null) return false

		// Remove existing single-status effects.
		const existing = this.effects.reduce(
			(
				arr: string[],
				e: InstanceType<
					ConfiguredDocumentClass<typeof foundry.documents.BaseActiveEffect>
				>
			) => {
				if (e.statuses.size === 1 && e.statuses.has(effectData.id as string))
					arr.push(e.id as string)
				return arr
			},
			[]
		)
		const state = active ?? existing.length === 0
		if (!state && existing.length > 0)
			await this.deleteEmbeddedDocuments('ActiveEffect', existing)
		// Add a new effect
		else if (state) {
			const cls = getDocumentClass('ActiveEffect')
			const createData = foundry.utils.deepClone(
				effectData
			) as ActiveEffectDataConstructorData
			createData.statuses = [effectData.id]
			// @ts-expect-error
			delete createData.id
			;(cls as any).migrateDataSafe(createData)
			;(cls as any).cleanData(createData)
			createData.name = game.i18n.localize(createData.name ?? '')
			if (overlay) createData['flags.core.overlay'] = true
			await cls.create(createData, { parent: this })
		}
		return state
	}

	/**
	 * Typeguard: is the provided value an IronswornActor instance of the specified type?
	 */
	static assert<T extends ConfiguredData<'Actor'>['type']>(
		actor: unknown,
		subtype: T
	): actor is IronswornActor<T> {
		return actor instanceof IronswornActor && actor.type === subtype
	}

	/** Typeguard: is this an instance of the specified type? */
	assert<T extends ConfiguredData<'Actor'>['type']>(
		subtype: T
	): this is IronswornActor<T> {
		return IronswornActor.assert(this, subtype)
	}

	static async createDialog(data, _options = {}) {
		if (CREATE_DIALOG == null) CREATE_DIALOG = new CreateActorDialog()
		CREATE_DIALOG.options.folder = data?.folder
		CREATE_DIALOG.render(true)
		return undefined
	}

	get isStarforgedOnlySheet() {
		const sfSheets = ['StarforgedCharacterSheet', 'StarshipSheet']
		return sfSheets.includes(this.sheet?.constructor.name as string)
	}

	get isClassicOnlySheet() {
		const classicSheets = ['IronswornCharacterSheetV2', 'IronswornSiteSheet']
		return classicSheets.includes(this.sheet?.constructor.name as string)
	}

	get toolset(): 'ironsworn' | 'starforged' {
		// We can't use IronswornSettings helpers here, it breaks the import orders
		// First check if the toolbox is set to one or the other
		const toolbox = game.settings.get('foundry-ironsworn', 'toolbox')
		if (toolbox !== 'sheet') return toolbox
		// Set to "match sheet", so check for a specific setting on this actor
		if (this.isStarforgedOnlySheet) return 'starforged'

		// Nope, now check the default character sheet class
		const sheetClasses = game.settings.get('core', 'sheetClasses') as any
		return sheetClasses.Actor?.character ===
			'ironsworn.StarforgedCharacterSheet'
			? 'starforged'
			: 'ironsworn'
	}

	protected override _onCreate(_data, _options, _userId): void {
		if (this.assert('character') || this.assert('shared'))
			void this.createEmbeddedDocuments(
				'Item',
				[{ type: 'bondset', name: 'bonds' }],
				{
					suppressLog: true
				} as any
			)
	}

	static override migrateData(src: ActorDataConstructorData) {
		src = super.migrateData(src)

		if ('debility' in src) {
			const source = src as ActorDataConstructorData & {
				debility: Record<string, boolean | string>
			}
			const sheetClass = source.flags?.core?.sheetClass

			const preferredRuleset =
				source.type === 'starship' ?? sheetClass?.includes('Starforged')
					? 'starforged'
					: IronswornSettings.impactSetDefault
			const preferredImpactType =
				preferredRuleset === 'starforged' ? 'impact' : 'debility'

			// Migrate boolean debility record object to ActiveEffect-based impacts
			if (source.effects == null)
				source.effects = [] as ActiveEffectDataConstructorData[]
			// convert any custom impacts
			const legacyCustomIDs = ['custom1', 'custom2']
			for (const id of legacyCustomIDs) {
				const value = source.debility[id]
				if (value !== true) continue
				const name =
					(source.debility[`${id}name`] as string) ??
					game.i18n.localize(
						`IRONSWORN.${preferredImpactType.toUpperCase()}.Custom`
					)

				source.effects.push(
					CONFIG.IRONSWORN.IronActiveEffect.statusToActiveEffectData(
						CONFIG.IRONSWORN.IronActiveEffect.createImpact({
							id: 'CustomImpact',
							name,
							icon: CONFIG.IRONSWORN.IronActiveEffect.IMPACT_ICON_DEFAULT
						})
					) as any
				)
			}

			for (const [key, value] of Object.entries(source.debility)) {
				// skip custom debilities, and anything that isn't toggled on
				if (key.startsWith('custom') || value !== true) continue
				const id = key === 'permanentlyharmed' ? 'permanently_harmed' : key
				const foundEffect =
					IronActiveEffect.statusEffects[preferredRuleset].find((fx) =>
						// use startsWith to catch things that now have a suffix, like cursed_starforged
						fx.id.startsWith(id)
					) ??
					// widen search to all available effects if none found in the preferred set
					Object.values(IronActiveEffect.statusEffects)
						.flat()
						.find((fx) => fx.id.startsWith(id))

				if (foundEffect == null) continue
				;(source.effects as any[]).push(foundry.utils.deepClone(foundEffect))
			}

			// @ts-expect-error
			delete source.debility
		}

		return src
	}
}
export interface IronswornActor<T extends DocumentSubTypes<'Actor'> = any>
	extends Actor {
	type: T
	statuses: Set<string>
	get effects(): EmbeddedCollection<
		ConfiguredDocumentClass<typeof foundry.documents.BaseActiveEffect> &
			DocumentConstructor,
		ActorData
	>
}

declare global {
	interface DocumentClassConfig {
		Actor: typeof IronswornActor
	}
}

import type { DocumentModificationOptions } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/abstract/document.mjs'
import { RANK_INCREMENTS } from '../constants'
import { getFoundryMoveByDfId } from '../dataforged'
import { IronswornPrerollDialog } from '../rolls'
import type {
	BondsetDataPropertiesData,
	DelveDomainDataPropertiesData,
	DelveSiteDanger,
	DelveSiteFeature,
	DelveThemeDataPropertiesData,
	ProgressDataPropertiesData,
	SFMoveDataPropertiesData
} from './itemtypes'

declare global {
	namespace Item {
		/**
		 * Migrate candidate source data for this DataModel which may require initial cleaning or transformations.
		 * @param source - The candidate source data from which the model will be constructed
		 * @returns Migrated source data, if necessary
		 */
		function migrateData(
			source: Record<string, unknown>
		): Record<string, unknown>
	}
}

/**
 * Extend the base Item entity
 * @extends {Item}
 */
export class IronswornItem extends Item {
	// Type hacks for v10 compatibility updates
	declare system: typeof this.data.data
	declare sort: typeof this.data.sort

	static override migrateData(source: Record<string, unknown>) {
		// run tihs first so we don't have to worry about e.g. data => system
		source = super.migrateData(source)

		/** Migration 6: rename type since it's the only kind of move we use now */
		if (source.type === 'sfmove') source.type = 'move'
		return source
	}

	protected override _onCreate(
		data: this['data']['_source'],
		options: DocumentModificationOptions,
		userId: string
	): void {
		super._onCreate(data, options, userId)

		switch (this.type) {
			case 'delve-theme':
			case 'delve-domain':
				{
					// initialize sourceId flags for delve site features and dangers
					this.system = this.system as
						| DelveDomainDataPropertiesData
						| DelveThemeDataPropertiesData
					const features = this.system.features.map(
						(feature: DelveSiteFeature) => {
							feature.flags['foundry-ironsworn'].sourceId = this.id
							return feature
						}
					)
					const dangers = this.system.dangers.map((danger: DelveSiteDanger) => {
						danger.flags['foundry-ironsworn'].sourceId = this.id
						return danger
					})
					this.update({ system: { features, dangers } })
				}
				break

			default:
				break
		}
	}

	/**
	 * Progress methods
	 */
	async markProgress(numMarks = 1) {
		if (this.type !== 'progress') return
		const system = this.system as ProgressDataPropertiesData

		const increment = RANK_INCREMENTS[system.rank] * numMarks
		let newValue = system.current + increment
		newValue = Math.min(newValue, 40)
		newValue = Math.max(newValue, 0)
		return await this.update({ 'system.current': newValue })
	}

	async clearProgress() {
		if (this.data.type !== 'progress') return
		return await this.update({ 'system.current': 0 })
	}

	async fulfill() {
		if (this.type !== 'progress') return
		const system = this.system as ProgressDataPropertiesData

		let moveDfId: string | undefined
		if (system.subtype === 'vow') {
			const toolset = this.actor?.toolset ?? 'starforged'
			moveDfId =
				toolset === 'starforged'
					? 'Starforged/Moves/Quest/Fulfill_Your_Vow'
					: 'Ironsworn/Moves/Quest/Fulfill_Your_Vow'
		}

		const progress = Math.floor(system.current / 4)
		return await IronswornPrerollDialog.showForProgress(
			this.name ?? '(progress)',
			progress,
			this.actor ?? undefined,
			moveDfId
		)
	}

	/**
	 * Bondset methods
	 */

	async writeEpilogue() {
		if (this.type !== 'bondset') return
		const system = this.system as BondsetDataPropertiesData

		const move = await getFoundryMoveByDfId(
			'Ironsworn/Moves/Relationship/Write_Your_Epilogue'
		)
		if (move == null) throw new Error('Problem loading write-epilogue move')

		const progress = Math.floor(Object.values(system.bonds).length / 4)
		IronswornPrerollDialog.showForOfficialMove(
			'Ironsworn/Moves/Relationship/Write_Your_Epilogue',
			{
				actor: this.actor ?? undefined,
				progress: {
					source: game.i18n.localize('IRONSWORN.ITEMS.TypeBond'),
					value: progress
				}
			}
		)
	}

	/**
	 * Move methods
	 */
	isProgressMove(): boolean | undefined {
		if (this.type !== 'move') return

		const sfMoveSystem = this.system as SFMoveDataPropertiesData
		return sfMoveSystem.Trigger.Options?.some(
			(option) => option['Roll type'] === 'Progress roll'
		)
	}
}

declare global {
	interface DocumentClassConfig {
		Item: typeof IronswornItem
	}
}

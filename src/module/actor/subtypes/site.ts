import type { TableResultDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/tableResultData'
import type { ChallengeRank } from 'dataforged'
import { ChallengeRankField } from '../../fields/ChallengeRankField'
import { ProgressTicksField } from '../../fields/ProgressTicksField'
import type { TableResultStub } from '../../fields/TableResultField'
import { TableResultField } from '../../fields/TableResultField'
import type { DataSchema } from '../../fields/utils'
import { OracleTable } from '../../roll-table/oracle-table'
import type { IronswornActor } from '../actor'

export class SiteData extends foundry.abstract.DataModel<
	SiteDataSourceData,
	IronswornActor<'site'>
> {
	static _enableV10Validation = true

	get denizenTable() {
		return new OracleTable({
			name: game.i18n.localize('IRONSWORN.DELVESITE.Denizens'),
			formula: '1d100',
			results: this.denizens.map(
				(row) =>
					mergeObject(
						row,
						{
							flags: {
								'foundry-ironsworn': {
									sourceId: this.parent.uuid,
									type: 'delve-site-denizen'
								}
							}
						},
						{ inplace: false }
					) as TableResultDataConstructorData
			),
			flags: {
				'foundry-ironsworn': {
					subtitle: this.parent.name,
					type: 'delve-site-denizens',
					sourceId: this.parent.uuid
				}
			}
		})
	}

	get theme() {
		return this.parent.itemTypes['delve-theme'][0]
	}

	get domain() {
		return this.parent.itemTypes['delve-domain'][0]
	}

	get features() {
		return new OracleTable({
			name: game.i18n.localize('IRONSWORN.DELVESITE.Features'),
			formula: '1d100',
			results: [...this.theme.system.features, ...this.domain.system.features],
			flags: {
				'foundry-ironsworn': {
					subtitle: this.parent.name,
					type: 'delve-site-features',
					sourceId: this.parent.uuid
				}
			}
		})
	}

	async getDangers() {
		const revealADanger = await OracleTable.getByDfId(
			'Ironsworn/Oracles/Moves/Reveal_a_Danger'
		)
		// skip the "Check the theme/domain card" rows
		const dangerRows = revealADanger?.results.contents.slice(2)
		if (dangerRows == null) return

		return new OracleTable({
			name: game.i18n.localize('IRONSWORN.DELVESITE.Dangers'),
			formula: '1d100',
			results: [
				...dangerRows.map(
					(row) =>
						mergeObject(
							row.toObject(),
							{
								flags: {
									'foundry-ironsworn': {
										sourceId: this.parent.uuid,
										type: 'delve-site-danger'
									}
								}
							},
							{ inplace: false }
						) as TableResultDataConstructorData
				),
				...this.theme.system.dangers,
				...this.domain.system.dangers
			],
			flags: {
				'foundry-ironsworn': {
					subtitle: this.parent.name,
					type: 'delve-site-dangers',
					sourceId: this.parent.uuid
				}
			}
		})
	}

	get hasThemeAndDomain() {
		return this.theme != null && this.domain != null
	}

	static override defineSchema(): DataSchema<SiteDataSourceData> {
		const fields = foundry.data.fields
		return {
			rank: new ChallengeRankField(),
			current: new ProgressTicksField(),
			objective: new fields.HTMLField(),
			description: new fields.HTMLField(),
			notes: new fields.HTMLField(),
			denizens: new fields.ArrayField(new TableResultField(), {
				initial: [
					{
						range: [1, 27],
						text: ''
					},
					{
						range: [28, 41],
						text: ''
					},
					{
						range: [42, 55],
						text: ''
					},
					{
						range: [56, 69],
						text: ''
					},
					{
						range: [70, 75],
						text: ''
					},
					{
						range: [76, 81],
						text: ''
					},
					{
						range: [82, 87],
						text: ''
					},
					{
						range: [88, 93],
						text: ''
					},
					{
						range: [94, 95],
						text: ''
					},
					{
						range: [96, 97],
						text: ''
					},
					{
						range: [98, 99],
						text: ''
					},
					{
						range: [100, 100],
						text: ''
					}
				]
			})
		}
	}
}

export interface SiteData extends SiteDataSourceData {}

interface SiteDataSourceData {
	objective: string
	description: string
	notes: string
	rank: ChallengeRank
	current: number
	denizens: TableResultStub[]
}

export interface SiteDataSource {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: SiteDataSourceData
	system: SiteDataSourceData
}
export interface SiteDataProperties {
	type: 'site'
	/**
	 * @deprecated
	 */
	data: SiteData
	system: SiteData
}

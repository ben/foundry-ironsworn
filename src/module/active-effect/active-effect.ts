import type {
	EffectChangeData,
	EffectChangeDataConstructorData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData'
import type { PartialBy, PartialDeep } from 'dataforged'
import { IronswornSettings } from '../helpers/settings'
import type { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import type {
	ConfiguredDocumentClass,
	DocumentSubTypes
} from '../../types/helperTypes'
import { sendToChat } from '../features/chat-alert'
import type { ImpactOptions } from './types'
import { MomentumField } from '../fields/MeterField'
import type { ImpactFlags } from './config'

type Ruleset = 'starforged' | 'classic'

export class IronActiveEffect extends ActiveEffect {
	static readonly MOMENTUM_RESET_PATH = 'system.momentum.resetValue'
	static readonly MOMENTUM_MAX_PATH = 'system.momentum.max'
	static readonly PRESETS: Record<
		Required<ImpactFlags>['type'],
		EffectChangeDataConstructorData[]
	> = {
		impact: [
			{
				key: this.MOMENTUM_MAX_PATH,
				mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
				value: '-1'
			},
			{
				key: this.MOMENTUM_RESET_PATH,
				mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
				value: '-1'
			}
		]
	}

	/** All status effects, organized by ruleset */
	static get statusEffects() {
		return {
			starforged: [
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'wounded',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Wounded'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg',
					noRecover: 'system.health',
					category: 'misfortunes'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'shaken',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Shaken'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg',
					noRecover: 'system.spirit',
					category: 'misfortunes'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'unprepared',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Unprepared'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg',
					noRecover: 'system.supply',
					category: 'misfortunes',
					global: true
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'permanently_harmed',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.PermanentlyHarmed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanently_harmed.svg',
					category: 'lastingEffects'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'traumatized',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Traumatized'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/traumatized.svg',
					category: 'lastingEffects'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'tormented',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Tormented'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg',
					category: 'burdens'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'doomed',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Doomed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg',
					category: 'burdens'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'indebted',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Indebted'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/indebted.svg',
					category: 'burdens'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'cursed_starforged',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Cursed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/cursed_starforged.svg',
					globalHint: true,
					category: 'vehicle'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'battered',
					ruleset: 'starforged',
					name: game.i18n.localize('IRONSWORN.IMPACT.Battered'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/battered.svg',
					globalHint: true,
					category: 'vehicle'
				})
			],
			classic: [
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'wounded',
					ruleset: 'classic',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Wounded'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg',
					noRecover: 'system.health',
					category: 'conditions'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'unprepared',
					ruleset: 'classic',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Unprepared'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg',
					noRecover: 'system.supply',
					global: true,
					category: 'conditions'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'shaken',
					ruleset: 'classic',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Shaken'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg',
					noRecover: 'system.spirit',
					category: 'conditions'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'encumbered',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/encumbered.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Encumbered'),
					category: 'conditions'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'maimed',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanently_harmed.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Maimed'),
					category: 'banes'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'corrupted',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/corrupted.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Corrupted'),
					category: 'banes'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'cursed',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Cursed'),
					category: 'burdens'
				}),
				CONFIG.IRONSWORN.IronActiveEffect.createImpact({
					id: 'tormented',
					ruleset: 'classic',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Tormented'),
					category: 'burdens'
				})
			]
		}
	}

	async toMessage(active: boolean) {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		const params = gameIsStarforged
			? { impact: game.i18n.localize(this.name) }
			: { debility: game.i18n.localize(this.name) }
		const i18nKey = active
			? CONFIG.IRONSWORN.IronActiveEffect.impactMarkedKey
			: CONFIG.IRONSWORN.IronActiveEffect.impactClearedKey
		const msg = game.i18n.format(i18nKey, params)
		const ActorClass = getDocumentClass('Actor')
		const speaker = this.parent
		if (!(speaker instanceof ActorClass)) return
		return await sendToChat(speaker, msg)
	}

	override _onCreate(data, options, userId) {
		super._onCreate(data, options, userId)
		switch (this.getFlag('foundry-ironsworn', 'type')) {
			case 'impact':
				if (this.modifiesActor && IronswornSettings.get('log-changes'))
					void this.toMessage(true)
				break

			default:
				break
		}
	}

	override _onUpdate(data, options, userId) {
		super._onUpdate(data, options, userId)
		switch (this.getFlag('foundry-ironsworn', 'type')) {
			case 'impact':
				{
					if (!(this.target instanceof Actor)) return
					const activeChanged = 'disabled' in data
					if (activeChanged && IronswornSettings.get('log-changes'))
						void this.toMessage(this.active)
				}
				break
			default:
				break
		}
	}

	override _onDelete(options, userId) {
		super._onDelete(options, userId)
		switch (this.getFlag('foundry-ironsworn', 'type')) {
			case 'impact':
				if (this.modifiesActor && IronswornSettings.get('log-changes'))
					void this.toMessage(false)
				break
			default:
				break
		}
	}

	static get impactMarkedKey() {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		return gameIsStarforged
			? `IRONSWORN.ChatAlert.MarkedImpact`
			: 'IRONSWORN.ChatAlert.MarkedDebility'
	}

	static get impactClearedKey() {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		return gameIsStarforged
			? `IRONSWORN.ChatAlert.ClearedImpact`
			: 'IRONSWORN.ChatAlert.ClearedDebility'
	}

	static get customLabelFallback() {
		return IronswornSettings.starforgedToolsEnabled
			? game.i18n.localize('IRONSWORN.IMPACT.Custom')
			: game.i18n.localize('IRONSWORN.DEBILITY.Custom')
	}

	static IMPACT_ICON_DEFAULT = 'icons/svg/downgrade.svg'

	/**
	 * Sets an active effect across all actors of the provided types.
	 * @param statusEffect Data for the status effect to be applied
	 * @param active Should the effect be set to active? If false, the effect will instead be disabled.
	 * @param actorTypes The types of actor for this effect to be applied to. (default: `['character', 'starship']`)
	 */
	static async setGlobal(
		statusEffect: StatusEffectV11,
		active: boolean,
		actorTypes: Array<DocumentSubTypes<'Actor'>> = ['character', 'starship']
	) {
		const actorsToUpdate =
			game.actors?.contents.filter((x) => actorTypes.includes(x.type)) ?? []

		for await (const actor of actorsToUpdate) {
			await actor.toggleActiveEffect(statusEffect, { active })
		}
	}

	static statusToActiveEffectData(effectData: StatusEffectV11) {
		const createData = foundry.utils.deepClone(effectData) as PartialBy<
			typeof effectData,
			'id'
		>
		createData.name = game.i18n.localize(effectData.name)
		;(createData as any).statuses = new Set(effectData.id)
		delete createData.id
		return createData as ActiveEffectDataConstructorData
	}

	/**
	 * Create constructor data for an ActiveEffect that represents an impact.
	 */
	static createImpact({
		id,
		name,
		icon,
		noRecover: preventRecovery,
		global,
		globalHint,
		category,
		disabled
	}: ImpactOptions) {
		if (icon == null) icon = this.IMPACT_ICON_DEFAULT
		const result: StatusEffectV11 = {
			id,
			disabled,
			name,
			// label: name, // June 15, 2023: workaround for a bug in 11.301 https://github.com/foundryvtt/foundryvtt/issues/9618
			icon: icon ?? this.IMPACT_ICON_DEFAULT,
			changes: foundry.utils.deepClone(this.PRESETS.impact) as any,
			flags: {
				'foundry-ironsworn': {
					type: 'impact',
					noRecover: preventRecovery,
					globalHint,
					global,
					category
				}
			}
		}

		if (result.name == null || result.name.length === 0)
			result.name = this.customLabelFallback

		if (preventRecovery != null)
			result.changes?.push(
				{
					key: `${preventRecovery}.value`,
					mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
					value: '0',
					priority: 10
				},
				{
					// TODO: revisit this. it might be better handled with a property that doesnt overlap with other things. 'noRecover'?
					key: `${preventRecovery}.noRecover`,
					mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
					value: 'true',
					priority: 10
				}
			)
		return result
	}
}

export interface IronActiveEffect {
	statuses: Set<string>
	parent: InstanceType<
		ConfiguredDocumentClass<typeof foundry.documents.BaseActor>
	> | null
	get name(): string
	/**
	 * Provide forward-compatibility with other Document types which use img as their primary image or icon.
	 * We are likely to formally migrate this in the future, but for now this getter provides compatible read access.
	 */
	get img(): string
	/**
	 * Retrieve the Document that this ActiveEffect targets for modification.
	 */
	get target(): InstanceType<
		ConfiguredDocumentClass<typeof foundry.documents.BaseActor>
	> | null
	/**
	 * Whether the Active Effect currently applying its changes to the target.
	 */
	get active(): boolean
	/**
	 * Does this Active Effect currently modify an Actor?
	 */
	get modifiesActor(): boolean
}

Hooks.on(
	'applyActiveEffect',
	/**
	 * Apply an ActiveEffect that uses a CUSTOM application mode.
	 * @param actor The actor the active effect is being applied to
	 * @param change The change data being applied
	 * @param current The current value being modified
	 * @param delta The parsed value of the change object
	 * @param changes An object which accumulates changes to be applied
	 */
	(
		actor: InstanceType<
			ConfiguredDocumentClass<typeof foundry.documents.BaseActor>
		>,
		change: EffectChangeData,
		current: boolean | string | number,
		delta: typeof current,
		changes: PartialDeep<typeof actor>
	) => {
		if (actor.type !== 'character') return change
		switch (change.key) {
			case CONFIG.IRONSWORN.IronActiveEffect.MOMENTUM_MAX_PATH:
				if (typeof current !== 'number' || typeof delta !== 'number')
					throw new Error()
				changes[change.key] = Math.clamped(
					current + delta,
					MomentumField.MIN,
					MomentumField.MAX
				)
				break
			case CONFIG.IRONSWORN.IronActiveEffect.MOMENTUM_RESET_PATH:
				if (typeof current !== 'number' || typeof delta !== 'number')
					throw new Error()
				changes[change.key] = Math.clamped(
					current + delta,
					MomentumField.RESET_MIN,
					MomentumField.MAX
				)
				break
			default:
				break
		}

		return changes
	}
)

/**
 * Filter token HUD status effect toggles by actor subtype by referencing its TypeDataModel#statusEffects property.
 */
Hooks.on(
	'renderTokenHUD',
	async (
		app: TokenHUD,
		// technically an HTMLFormElement, but we don't care about that
		html: JQuery<HTMLElement>,
		data: TokenHUD.RenderOptions
	) => {
		const doc = app.object?.actor

		// fall back to allowing everything if the required info is missing
		if (doc == null || doc.validImpacts == null) return

		const statuses = Object.fromEntries(
			doc.validImpacts.map((status) => {
				const isActive = doc.statuses.has(status.id)
				const isOverlay = ((status as any).overlay ??
					(doc as any).overlayEffect === status.icon) as boolean
				return [
					status.icon,
					{
						id: status.id,
						title: status.name?.capitalize(),
						src: status.icon,
						isActive,
						isOverlay,
						cssClass: [
							isActive ? 'active' : null,
							isOverlay ? 'overlay' : null
						].filterJoin(' ')
					}
				]
			})
		)

		const buttons = Object.values(statuses)
			.map(
				(status: any) =>
					`<img class="effect-control ${
						(status.isActive as boolean) ? 'active' : ''
					}" src="${status.src as string}" title="${
						status.title as string
					}" data-status-id="${status.id as string}">`
			)
			.join('\n')

		data.statusEffects = statuses

		html.find('.status-effects').html(buttons)
	}
)

import { IronswornActor } from '../actor/actor'
import type {
	EffectChangeData,
	EffectChangeDataConstructorData
} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/effectChangeData'
import type { PartialBy, PartialDeep } from 'dataforged'
import { IronswornSettings } from '../helpers/settings'
import type { ActiveEffectDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/activeEffectData'
import type { DocumentSubTypes } from '../../types/helperTypes'
import { sendToChat } from '../features/chat-alert'
import type { ImpactOptions } from './types'
import { MomentumField } from '../fields/MeterField'
import type { ImpactFlags } from './config'
import { capitalize } from '../helpers/util'

type Ruleset = 'starforged' | 'classic'

export interface IronActiveEffect {
	statuses: Set<string>
}
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

	async toMessage(active: boolean) {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		const params = gameIsStarforged
			? { impact: game.i18n.localize(this.name) }
			: { debility: game.i18n.localize(this.name) }
		const i18nKey = active
			? IronActiveEffect.impactMarkedString
			: IronActiveEffect.impactClearedString
		const msg = game.i18n.format(i18nKey, params)
		const speaker =
			this.parent instanceof IronswornActor ? this.parent : this.parent?.parent
		if (!(speaker instanceof IronswornActor)) return
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

	static get impactMarkedString() {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		return gameIsStarforged
			? `IRONSWORN.ChatAlert.MarkedImpact`
			: 'IRONSWORN.ChatAlert.MarkedDebility'
	}

	static get impactClearedString() {
		const gameIsStarforged = IronswornSettings.starforgedToolsEnabled
		return gameIsStarforged
			? `IRONSWORN.ChatAlert.ClearedImpact`
			: 'IRONSWORN.ChatAlert.ClearedDebility'
	}

	static get customLabelFallback() {
		return IronswornSettings.starforgedToolsEnabled
			? 'IRONSWORN.IMPACT.Custom'
			: 'IRONSWORN.DEBILITY.Custom'
	}

	static IMPACT_ICON_DEFAULT = 'icons/svg/downgrade.svg'

	/**
	 * Sets an active effect across all actors of the provided types.
	 * @param statusEffect Data for the status effect to be applied
	 * @param active Should the effect be set to active? If false, the effect will instead be disabled.
	 * @param actorTypes The types of actor for this effect to be applied to. (default: `['character', 'starship']`)
	 */
	static async setGlobal(
		statusEffect: StatusEffect,
		active: boolean,
		actorTypes: Array<DocumentSubTypes<'Actor'>> = ['character', 'starship']
	) {
		const actorsToUpdate =
			game.actors?.contents.filter((x) => actorTypes.includes(x.type)) ?? []

		for await (const actor of actorsToUpdate) {
			await actor.toggleActiveEffect(statusEffect, { active })
		}
	}

	static statusToActiveEffectData(effectData: StatusEffect) {
		const createData = foundry.utils.deepClone(effectData) as PartialBy<
			typeof effectData,
			'id'
		>
		createData.name = game.i18n.localize(effectData.name as string)
		createData['flags.core.statusId'] = effectData.id
		// delete createData.id
		return createData as ActiveEffectDataConstructorData
	}

	/**
	 * Create constructor data for an ActiveEffect that represents an impact.
	 */
	static createImpact({
		id,
		name,
		icon,
		preventRecovery,
		global,
		globalHint,
		category,
		disabled
	}: ImpactOptions) {
		if (icon == null) icon = this.IMPACT_ICON_DEFAULT
		const result: StatusEffect = {
			id,
			disabled,
			name,
			label: name, // workaround for a bug in 11.301: https://github.com/foundryvtt/foundryvtt/issues/9618
			icon: icon ?? IronActiveEffect.IMPACT_ICON_DEFAULT,
			duration: null,
			statuses: [id],
			changes: foundry.utils.deepClone(this.PRESETS.impact),
			flags: {
				'foundry-ironsworn': {
					type: 'impact',
					preventRecovery,
					globalHint,
					global,
					category
				}
			}
		}

		if (result.name == null || result.name.length === 0)
			result.name = IronActiveEffect.customLabelFallback

		if (preventRecovery != null)
			result.changes?.push({
				key: preventRecovery,
				mode: CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
				value: '0'
			})
		return result
	}

	/** All status effects, organized by ruleset */
	static get STATUS_EFFECTS(): Record<Ruleset, StatusEffect[]> {
		return {
			starforged: [
				this.createImpact({
					id: 'wounded',
					name: game.i18n.localize('IRONSWORN.IMPACT.Wounded'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg',
					preventRecovery: 'system.health.value',
					category: 'misfortunes'
				}),
				this.createImpact({
					id: 'shaken',
					name: game.i18n.localize('IRONSWORN.IMPACT.Shaken'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg',
					preventRecovery: 'system.spirit.value',
					category: 'misfortunes'
				}),
				this.createImpact({
					id: 'unprepared',
					name: game.i18n.localize('IRONSWORN.IMPACT.Unprepared'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg',
					preventRecovery: 'system.supply.value',
					category: 'misfortunes',
					global: true
				}),
				this.createImpact({
					id: 'permanentlyharmed',
					name: game.i18n.localize('IRONSWORN.IMPACT.Permanentlyharmed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanentlyharmed.svg',
					category: 'lastingEffects'
				}),
				this.createImpact({
					id: 'traumatized',
					name: game.i18n.localize('IRONSWORN.IMPACT.Traumatized'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/traumatized.svg',
					category: 'lastingEffects'
				}),
				this.createImpact({
					id: 'tormented',
					name: game.i18n.localize('IRONSWORN.IMPACT.Tormented'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg',
					category: 'burdens'
				}),
				this.createImpact({
					id: 'doomed',
					name: game.i18n.localize('IRONSWORN.IMPACT.Doomed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg',
					category: 'burdens'
				}),
				this.createImpact({
					id: 'indebted',
					name: game.i18n.localize('IRONSWORN.IMPACT.Indebted'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/indebted.svg',
					category: 'burdens'
				}),
				this.createImpact({
					id: 'cursed',
					name: game.i18n.localize('IRONSWORN.IMPACT.Cursed'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/cursed_starforged.svg',
					globalHint: true,
					category: 'vehicle'
				}),
				this.createImpact({
					id: 'battered',
					name: game.i18n.localize('IRONSWORN.IMPACT.Battered'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/battered.svg',
					globalHint: true,
					category: 'vehicle'
				})
			],
			classic: [
				this.createImpact({
					id: 'wounded',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Wounded'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/wounded.svg',
					preventRecovery: 'system.health.value',
					category: 'conditions'
				}),
				this.createImpact({
					id: 'unprepared',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Unprepared'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/unprepared.svg',
					preventRecovery: 'system.supply.value',
					global: true,
					category: 'conditions'
				}),
				this.createImpact({
					id: 'shaken',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Shaken'),
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/shaken.svg',
					preventRecovery: 'system.spirit.value',
					category: 'conditions'
				}),
				this.createImpact({
					id: 'encumbered',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/encumbered.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Encumbered'),
					category: 'conditions'
				}),
				this.createImpact({
					id: 'maimed',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/permanentlyharmed.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Maimed'),
					category: 'banes'
				}),
				this.createImpact({
					id: 'corrupted',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/corrupted.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Corrupted'),
					category: 'banes'
				}),
				this.createImpact({
					id: 'cursed',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/doomed.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Cursed'),
					category: 'burdens'
				}),
				this.createImpact({
					id: 'tormented',
					icon: 'systems/foundry-ironsworn/assets/icons/impacts/tormented.svg',
					name: game.i18n.localize('IRONSWORN.DEBILITY.Tormented'),
					category: 'burdens'
				})
			]
		}
	}

	/** A flat array of all status IDs across all rulesets. */
	static get CANONICAL_IMPACT_IDS() {
		return Array.from(new Set(Object.values(this.STATUS_EFFECTS).flat())).map(
			({ id }) => id
		)
	}

	static renderStatusEffectHUD(
		effects: IronActiveEffect[],
		effectsClass: string
	) {
		// adapted from templates/hud/token-hud.html (v11)
		return `
      <div class="control-icon ${effectsClass}" data-action="effects">
        <img src="${
					CONFIG.controlIcons.effects
				}" width="36" height="36" title="${game.i18n.localize(
			'HUD.AssignStatusEffects'
		)}"/>
        <div class="status-effects">
         ${effects.map((fx) => fx.renderStatusToggle()).join('')}
        </div>
      </div>`
	}

	renderStatusToggle() {
		// adapted from templates/hud/token-hud.html (v11)
		const cssClass = this.active ? 'active' : ''
		return `<img class="effect-control ${cssClass}" src="${this.img}"
                     title="${capitalize(this.name)}" data-status-id="${
			this.statuses[0] as string
		}"/>`
	}

	static getStatusEffectRenderData(e: StatusEffect) {
		const isActive
		const isOverlay

		return {
			id: e.id ?? '',
			title: e.name ? game.i18n.localize(e.name) : null,
			src: e.icon,
			isActive,
			isOverlay,
			cssClass: [
				isActive ? 'active' : null,
				isOverlay ? 'overlay' : null
			].filterJoin(' ')
		}
	}
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
		actor: IronswornActor,
		change: EffectChangeData,
		current: boolean | string | number,
		delta: typeof current,
		changes: PartialDeep<typeof actor>
	) => {
		if (actor.type !== 'character') return change
		switch (change.key) {
			case IronActiveEffect.MOMENTUM_MAX_PATH:
				if (typeof current !== 'number' || typeof delta !== 'number')
					throw new Error()
				changes[change.key] = Math.clamped(
					current + delta,
					MomentumField.MIN,
					MomentumField.MAX
				)
				break
			case IronActiveEffect.MOMENTUM_RESET_PATH:
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

// Hooks.on('init', async () => {
// 	CONFIG.controlIcons.effects = IronActiveEffect.IMPACT_ICON_DEFAULT
// })

/**
 * Filter token HUD status effect toggles by actor subtype by referencing its TypeDataModel#tokenStatusEffects property.
 */
Hooks.on(
	'renderTokenHUD',
	async (
		app: TokenHUD,
		// technically an HTMLFormElement, but we don't care about that
		html: JQuery<HTMLElement>,
		_: TokenHUD.RenderOptions
	) => {
		const actor = app.object?.actor

		// fall back to allowing everything if the required info is missing
		if (actor == null || actor.system.tokenStatusEffects == null) return

		// select all elements with a statusId data attribute that *aren't* a legal status effect
		const selector = `[data-status-id]${actor.system.tokenStatusEffects
			.map(({ id }) => `:not([data-status-id="${id as string}"])`)
			.join('')}`

		for (const el of html.find(selector)) {
			el.remove()
		}
	}
)

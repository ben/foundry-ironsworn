import type { DFIOutcomeInfo, DFRollMethod } from '../item/types'
import { compact, fromPairs, isUndefined, kebabCase } from 'lodash-es'
import { IronswornRoll } from '.'
import { IronswornActor } from '../actor/actor'
import { OracleTable } from '../roll-table/oracle-table'
import { enrichMarkdown } from '../vue/vue-plugin'
import { DfRollOutcome, RollOutcome } from './ironsworn-roll'
import type { CombatPosition } from './combat-position'
import { combatPositionLabelKey, isClassicMove } from './combat-position'
import type { OutcomeGain } from './move-outcome-effects'
import { isOutcomeChoice, outcomeEffects } from './move-outcome-effects'
import { renderRollGraphic } from './roll-graphic'
import { IronswornSettings } from '../helpers/settings'

/** A gain the roll card can apply, with the key that records its use. */
interface KeyedGain {
	key: string
	gain: OutcomeGain
}

/** A row of gain buttons on the roll card: a lone gain, or one choice. */
interface KeyedGainGroup {
	/** How many of the gains may be used: 1 for a lone gain. */
	choose: number
	gains: KeyedGain[]
}

interface OutcomeGainButton {
	key: string
	label: string
	used: boolean
	disabled: boolean
}

interface OutcomeGainGroupData {
	heading?: string
	buttons: OutcomeGainButton[]
}

interface MoveTemplateData {
	outcomeClass?: string
	outcomeText?: string
	outcomeReplacementReason?: string
	moveOutcome?: string
}

/**
 * Shortcut for composing a localized string similar to "roll +{stat}".
 * @param stat The stat to use; should be lowercase, or have an initial capital letter.
 * @returns A localized string. If no stat is available it uses the provided string as the stat name instead.
 *  * @example
 * ```typescript
 * formatRollPlusStat("heart")
 * // returns "roll +heart" for en.json
 * ```
 */
export function formatRollPlusStat(stat: string, initialCaps = false) {
	if (stat.startsWith('IRONSWORN.')) stat = game.i18n.localize(stat)
	const key = initialCaps ? 'IRONSWORN.Roll +x' : 'IRONSWORN.roll +x'
	return game.i18n.format(key, { stat })
}

/**
 * Composes a localized string describing the stat options available to a particular move trigger. Falls back to {@link formatRollPlusStat} when there's only one stat available.
 * @param rollMethod The Dataforged roll method to generate a string for.
 * @param stats One or more stat strings.
 * @example formatRollMethod("Highest", ["Spirit", "Heart"])
 * // returns "roll +wits or +iron, whichever is higher" for en.json
 * @example formatRollMethod("Highest", ["Spirit", "Heart", "Wits"])
 * // returns "roll highest of spirit, heart, wits" for en.json
 */
export function formatRollMethod(rollMethod: DFRollMethod, stats: string[]) {
	const localizedStats = stats.map((stat) =>
		game.i18n.localize('IRONSWORN.' + stat.capitalize())
	)

	// skip if there's no choice to be made
	if (localizedStats.length === 1) {
		return formatRollPlusStat(localizedStats[0])
	}

	// canonical triggers have 2 stats; there's a good chance a nice string already exists, so we check for that first.
	const methodKeyRoot = `IRONSWORN.roll method.${rollMethod}`
	const possibleNiceKey = `${methodKeyRoot}.${stats.length}`
	if (game.i18n.has(possibleNiceKey)) {
		/**
		 * @example {stat1: "iron", stat2: "health"}
		 */
		const statStringHash = fromPairs(
			localizedStats.map((stat, index) => [`stat${index + 1}`, stat])
		)
		return game.i18n.format(possibleNiceKey, statStringHash)
	}
	const fallbackKey = `${methodKeyRoot}.fallback`

	// TODO: figure out if the separator would differ in some languages?
	const separator = ', '
	const statList = localizedStats.join(separator)
	return game.i18n.format(fallbackKey, {
		statList
	})
}

/**
 * Computes the outcome of an Ironsworn action roll or progress roll.
 * @param score The score (e.g. action score or progress score) to compare to the challenge dice.
 * @param challengeDie1 The value of the first challenge die.
 * @param challengeDie2 The value of the second challenge die.
 */
export function computeRollOutcome(
	score: number,
	challengeDie1: number,
	challengeDie2: number
): RollOutcome {
	return [challengeDie1, challengeDie2].filter(
		(challengeDie) => score > challengeDie
	).length
}

/**
 * Retrieves a localized string corresponding to a provided roll outcome.
 * @param outcome The numeric outcome value to retrieve the string for.
 * @param match Whether or not the outcome has matched challenge dice.
 */
export function computeOutcomeText(
	outcome: RollOutcome | DfRollOutcome,
	match?: boolean | undefined
) {
	let outcomeKey = RollOutcome[outcome]
	if (match) {
		outcomeKey += '_match'
	}
	return game.i18n.localize(`IRONSWORN.${outcomeKey}`)
}

/**
 * Will burning momentum improve the outcome of an Ironsworn action roll?
 * @param rawOutcome The outcome before burning momentum.
 * @param momentumOutcome The outcome after burning momentum.
 */
export function momentumBurnWouldUpgrade(
	rawOutcome: RollOutcome | undefined,
	momentumOutcome: RollOutcome
) {
	return rawOutcome ? momentumOutcome > rawOutcome : false
}

type i18nOutcomeKey =
	| `${keyof typeof RollOutcome}`
	| `${keyof typeof RollOutcome}_match`

export function outcomeKey(
	outcome: RollOutcome,
	match: boolean
): i18nOutcomeKey {
	let key: i18nOutcomeKey = RollOutcome[outcome] as keyof typeof RollOutcome
	if (match) {
		key += '_match'
	}
	return key as i18nOutcomeKey
}

export class IronswornRollMessage {
	constructor(public roll: IronswornRoll, public actor?: IronswornActor) {
		if (actor == null && roll.preRollOptions.actorId) {
			this.actor = game.actors?.get(roll.preRollOptions.actorId)
		}
	}

	static async fromMessage(
		messageId: string
	): Promise<IronswornRollMessage | undefined> {
		const msg = game.messages?.get(messageId)
		const html = await msg?.getHTML()

		// Reconstitute roll
		const json = html?.find('.ironsworn-roll').data('ironswornroll')
		if (!json) return undefined

		const r = IronswornRoll.fromJson(json)
		r.chatMessageId = messageId

		r.roll = msg?.rolls?.[0] ?? undefined

		return new IronswornRollMessage(r)
	}

	async burnMomentum() {
		if (!IronswornActor.assert(this.actor, 'character')) return
		const { momentum } = this.actor.system

		const [c1, c2] = this.roll.finalChallengeDice ?? []
		if (c1 === undefined || c2 === undefined) return

		await this.actor.system.burnMomentum()
		this.roll.postRollOptions.replacedOutcome = {
			value: computeRollOutcome(momentum.value, c1.value, c2.value),
			source: game.i18n.localize('IRONSWORN.MomentumBurnt')
		}
		return await this.createOrUpdate()
	}

	/**
	 * Sets the rolling character's combat position (in control / in a bad spot;
	 * classic: initiative), as offered by the outcome of a combat move.
	 */
	async setCombatPosition(position: CombatPosition) {
		if (!IronswornActor.assert(this.actor, 'character')) return
		await this.actor.update({ system: { combatPosition: position } })
	}

	/**
	 * Applies one of the outcome's gains (e.g. "+2 momentum", "+1 on your next
	 * move") to the rolling character. Each gain can be used once per roll, and
	 * a choice only as many times as it allows.
	 * @param key The gain's key, from the roll card's button.
	 */
	async applyOutcomeGain(key: string) {
		if (!IronswornActor.assert(this.actor, 'character')) return
		const used = this.roll.postRollOptions.usedOutcomeGains ?? []
		if (used.includes(key)) return

		const group = (await this.outcomeGainGroups()).find((g) =>
			g.gains.some((x) => x.key === key)
		)
		if (group == null) return
		const usedInGroup = group.gains.filter((x) => used.includes(x.key)).length
		if (usedInGroup >= group.choose) return

		const { gain } = group.gains.find((x) => x.key === key)!
		await this.applyGain(this.actor, gain)
		this.roll.postRollOptions.usedOutcomeGains = [...used, key]
		return await this.createOrUpdate()
	}

	private async applyGain(
		actor: IronswornActor<'character'>,
		gain: OutcomeGain
	) {
		if (gain.kind === 'nextMoveBonus') {
			const move = await this.roll.moveItem
			await actor.system.addNextMoveBonus(move?.name ?? '', gain.value)
			return
		}

		const meter = actor.system[gain.meter]
		const max = gain.meter === 'momentum' ? actor.system.momentumMax : meter.max
		// Never lower a meter that's already over its maximum
		const value = Math.max(meter.value, Math.min(meter.value + gain.value, max))
		const data = { [`system.${gain.meter}.value`]: value }
		await actor.update(data)
		if (gain.meter === 'supply' && IronswornSettings.get('shared-supply')) {
			await IronswornSettings.updateGlobalAttribute(data)
		}
	}

	async createOrUpdate() {
		await this.roll.evaluate()

		// console.log('sent renderData', renderData)
		const renderData = {
			graphic: await renderRollGraphic({ roll: this.roll, hideOutcome: true }),
			ironswornroll: this.roll.serialize(),
			move: await this.roll.moveItem,
			...(await this.titleData()),
			...(await this.moveData()),
			...(await this.challengeDiceData()),
			...(await this.momentumData()),
			...(await this.oraclesData()),
			...(await this.combatPositionData()),
			...(await this.outcomeGainData())
		}
		const content = await foundry.applications.handlebars.renderTemplate(
			'systems/foundry-ironsworn/templates/rolls/ironsworn-roll-message.hbs',
			renderData
		)

		if (this.roll.chatMessageId) {
			const msg = game.messages?.get(this.roll.chatMessageId)
			return await msg?.update({ content })
		} else {
			const speaker = ChatMessage.getSpeaker()
			if (this.actor != null) {
				speaker.actor = this.actor.id
				speaker.alias = this.actor.name || undefined
			}
			const messageData = {
				speaker,
				content,
				style: CONST.CHAT_MESSAGE_STYLES.OTHER,
				roll: this.roll.roll,
				rolls: [this.roll.roll]
			}

			const cls = CONFIG.ChatMessage.documentClass
			const msg = await cls.create(messageData as any, {})
			this.roll.chatMessageId = msg?.id
			return msg
		}
	}

	private async titleData(): Promise<{
		title: string
	}> {
		const move = await this.roll.moveItem

		const { progress, stat } = this.roll.preRollOptions
		if (progress != null) {
			const prefix = move?.name || game.i18n.localize('IRONSWORN.ProgressRoll')
			return {
				title: `${prefix}: ${progress.source}`
			}
		}

		if (stat == null) throw new Error('Need progress or stat here')

		if (move != null) {
			return { title: `${move.name} +${stat.source}` }
		}
		let localizedStat = game.i18n.localize(
			'IRONSWORN.' + stat.source.capitalize()
		)
		if (localizedStat.startsWith('IRONSWORN.')) localizedStat = stat.source
		return {
			title: game.i18n.format('IRONSWORN.roll +x', { stat: localizedStat })
		}
	}

	private async moveData(): Promise<MoveTemplateData> {
		// Outcome can be overridden
		const theOutcome = this.roll.finalOutcome?.value
		if (theOutcome === undefined) return {}

		// Original outcome
		const ret: MoveTemplateData = {
			outcomeText: computeOutcomeText(theOutcome, this.roll.isMatch),
			outcomeClass: `${kebabCase(RollOutcome[theOutcome])}${
				this.roll.isMatch ? ' match' : ''
			}`,
			outcomeReplacementReason:
				this.roll.postRollOptions.replacedOutcome?.source
		}
		const move = await this.roll.moveItem
		if (move?.type !== 'sfmove') return ret

		const key = DfRollOutcome[theOutcome]
		const moveSystem = move.system
		let moveOutcome = moveSystem.Outcomes?.[key] as DFIOutcomeInfo | undefined
		if (this.roll.isMatch && moveOutcome?.['With a Match']?.Text)
			moveOutcome = moveOutcome['With a Match']
		if (moveOutcome) {
			// Get the rendered markdown here. If there are oracles, we strip
			// out the tables, because there will be a button in the chat message.
			// If no oracles, that table is probably important to the move
			// (i.e. SF's "Repair" move), so we leave it in.
			ret.moveOutcome = await enrichMarkdown(moveOutcome.Text)
			if (moveSystem.dsOracleIds?.length > 0) {
				ret.moveOutcome = ret.moveOutcome.replace(
					/<table>[\s\S]*<\/table>/gm,
					''
				)
			}
		}
		return ret
	}

	private challengeDiceData() {
		// Only continue if this roll needs manual resolution
		if (this.roll.preRollOptions.extraChallengeDice == null) return {}
		const { replacedChallenge1, replacedChallenge2 } = this.roll.postRollOptions
		if (replacedChallenge1 != null && replacedChallenge2 != null) return {}

		return {
			unresolved: true
		}
	}

	private momentumData() {
		if (!IronswornActor.assert(this.actor, 'character')) return {}

		// Can't burn momentum on progress rolls
		if (this.roll.preRollOptions.progress != null) return {}

		// If momentum has already been burnt, do not suggest more burns
		if (this.roll.postRollOptions.replacedOutcome != null) return {}

		const [c1, c2] = this.roll.finalChallengeDice ?? []
		if (c1 === undefined || c2 === undefined) return {}

		const { momentum } = this.actor.system
		const rawOutcome = this.roll.rawOutcome?.value
		const momentumBurnOutcome = computeRollOutcome(
			momentum.value,
			c1.value,
			c2.value
		)

		if (!isUndefined(rawOutcome) && momentumBurnOutcome > rawOutcome) {
			return {
				possibleMomentumBurn: computeOutcomeText(
					momentumBurnOutcome,
					c1.value === c2.value
				)
			}
		}
		return {}
	}

	private async oraclesData(): Promise<any> {
		const move = await this.roll.moveItem
		if (move?.type !== 'sfmove') return {}

		const system = move.system
		const dsids = system.dsOracleIds ?? []
		const nextOracles = compact(
			await Promise.all(dsids.map((x) => OracleTable.getByDsId(x)))
		)
		return { nextOracles }
	}

	private async moveDsId(): Promise<string | undefined> {
		const move = await this.roll.moveItem
		const dsid = move?.getFlag('foundry-ironsworn', 'dsid')
		return typeof dsid === 'string' ? dsid : this.roll.preRollOptions.moveDsId
	}

	private async combatPositionData(): Promise<{
		combatPositions?: Array<{ position: CombatPosition; label: string }>
	}> {
		if (!IronswornActor.assert(this.actor, 'character')) return {}
		const moveDsId = await this.moveDsId()
		const positions =
			outcomeEffects(moveDsId, this.roll.finalOutcome?.value)?.positions ?? []
		if (positions.length === 0) return {}

		const classic = isClassicMove(moveDsId)
		return {
			combatPositions: positions.map((position) => ({
				position,
				label: game.i18n.localize(combatPositionLabelKey(position, classic))
			}))
		}
	}

	/**
	 * The current outcome's gains, each with a key that records its use. Gains
	 * ruled out by the character's impacts ("if you are not wounded") are left
	 * out.
	 */
	private async outcomeGainGroups(): Promise<KeyedGainGroup[]> {
		if (!IronswornActor.assert(this.actor, 'character')) return []
		const outcome = this.roll.finalOutcome?.value
		const effects = outcomeEffects(await this.moveDsId(), outcome)
		const { debility } = this.actor.system

		const groups: KeyedGainGroup[] = []
		for (const [i, entry] of (effects?.gains ?? []).entries()) {
			const keyed: KeyedGain[] = isOutcomeChoice(entry)
				? entry.options.map((gain, j) => ({
						key: `${outcome}:${i}.${j}`,
						gain
				  }))
				: [{ key: `${outcome}:${i}`, gain: entry }]
			const gains = keyed.filter(
				({ gain }) =>
					gain.kind !== 'meter' ||
					gain.unlessImpact == null ||
					!debility[gain.unlessImpact]
			)
			if (gains.length === 0) continue
			groups.push({
				choose: isOutcomeChoice(entry) ? entry.choose : 1,
				gains
			})
		}
		return groups
	}

	private async outcomeGainData(): Promise<{
		outcomeGains?: OutcomeGainGroupData[]
	}> {
		const groups = await this.outcomeGainGroups()
		if (groups.length === 0) return {}

		const used = this.roll.postRollOptions.usedOutcomeGains ?? []
		return {
			outcomeGains: groups.map(({ choose, gains }) => {
				const usedInGroup = gains.filter((x) => used.includes(x.key)).length
				return {
					// A choice whose other options aren't buttons needs no heading
					heading:
						gains.length > choose
							? game.i18n.localize(
									choose === 1
										? 'IRONSWORN.OutcomeGain.ChooseOne'
										: 'IRONSWORN.OutcomeGain.ChooseTwo'
							  )
							: undefined,
					buttons: gains.map(({ key, gain }) => {
						const isUsed = used.includes(key)
						return {
							key,
							label: outcomeGainLabel(gain, isUsed),
							used: isUsed,
							disabled: isUsed || usedInGroup >= choose
						}
					})
				}
			})
		}
	}
}

/** The roll-card label for a gain, e.g. "Take +2 Momentum" or "Took +2 Momentum". */
function outcomeGainLabel(gain: OutcomeGain, used: boolean): string {
	const value = `${gain.value >= 0 ? '+' : ''}${gain.value}`
	if (gain.kind === 'nextMoveBonus') {
		return game.i18n.format(
			used
				? 'IRONSWORN.NextMoveBonus.Added'
				: 'IRONSWORN.NextMoveBonus.AddFromRoll',
			{ value }
		)
	}
	return game.i18n.format(
		used ? 'IRONSWORN.OutcomeGain.Took' : 'IRONSWORN.OutcomeGain.Take',
		{ value, meter: game.i18n.localize(`IRONSWORN.${gain.meter.capitalize()}`) }
	)
}

<template>
	<article ref="legacyTrack" class="legacy-track flexcol" :data-legacy="legacy">
		<h4 class="legacy-track-title">
			{{ $t(`IRONSWORN.LEGACY.${legacy.capitalize()}`) }}
		</h4>

		<section class="legacy-track-controls flexrow" data-tooltip-direction="UP">
			<span v-if="overflowLabel" class="nogrow">
				{{ overflowLabel }}
			</span>
			<IronBtn
				v-if="editMode"
				block
				nogrow
				icon="fa:caret-left"
				@click="decrease" />
			<IronBtn
				block
				nogrow
				icon="fa:caret-right"
				:data-tooltip="markTooltip"
				@click="increase" />
		</section>

		<ProgressTrack
			class="legacy-track-progress"
			:ticks="ticksDisplayed"
			:rank="null"
			:aria-valuemax="undefined"
			:legacy-overflow="ticks >= maxTicks"
			data-tooltip-direction="UP" />
		<XpTrack
			:max="xpEarned"
			:marked="xpSpent"
			class="legacy-track-xp"
			@click="setXp" />
	</article>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'
import { clamp } from 'lodash-es'
import XpTrack from './xp-track.vue'
import ProgressTrack from './progress/progress-track.vue'

// TODO: make this use an enum from dataforged instead, once rsek gets around to adding it
type LegacyType = 'quests' | 'bonds' | 'discoveries'

// TODO: switch to Dataforged consts when available thru DF2
const maxBoxes = 10
const maxScore = maxBoxes
const ticksPerBox = 4
const maxTicks = maxBoxes * ticksPerBox
const minTicks = 0
const xpEarnedPerBox = 2
const xpEarnedPerOverflowBox = 1

const props = defineProps<{
	/**
	 * The legacy track type.
	 */
	legacy: LegacyType
}>()

const $actor = inject($ActorKey)
const actor = inject(ActorKey) as Ref

const ticks = computed(
	() => actor.value.system.legacies?.[props.legacy] ?? minTicks
)
const ticksDisplayed = computed(() => ticks.value % maxTicks)

const score = computed(() =>
	clamp(Math.floor(ticks.value / ticksPerBox), 0, maxScore)
)

const xpEarned = computed(() => {
	const fullRateXp = score.value * xpEarnedPerBox
	if (ticks.value > maxTicks) {
		const overflowTicks = ticks.value - maxTicks
		const overflowBoxes = Math.floor(overflowTicks / ticksPerBox)
		const overflowXp = overflowBoxes * xpEarnedPerOverflowBox
		return fullRateXp + overflowXp
	}
	return fullRateXp
})

const xpSpent = computed(
	() => actor.value.system?.legacies[`${props.legacy}XpSpent`] ?? 0
)

const markTooltip = computed(() => {
	let legacy = game.i18n.localize(
		`IRONSWORN.LEGACY.${props.legacy.capitalize()}`
	)
	let amount = game.i18n.localize(`IRONSWORN.PROGRESS.TICK.1`)
	return game.i18n.format(`IRONSWORN.MarkLegacy`, { amount, legacy })
})

const editMode = computed(
	() =>
		(actor.value.flags as Record<string, any>)['foundry-ironsworn']?.[
			'edit-mode'
		]
)

const overflowLabel = computed(() => {
	const n = Math.floor(ticks.value / maxTicks) * 10
	if (n > 0) {
		return `(+${n})`
	}
	return undefined
})

function setXp(newValue: number) {
	$actor?.update({
		[`system.legacies.${props.legacy}XpSpent`]: newValue
	})
}

function adjustTrack(inc) {
	const current = actor.value.system?.legacies[props.legacy] ?? 0
	$actor?.update({
		[`system.legacies.${props.legacy}`]: current + inc
	})
}
function increase() {
	adjustTrack(1)
}
function decrease() {
	adjustTrack(-1)
}
</script>
<style lang="scss">
[data-legacy='discoveries'] {
	--ironsworn-color-thematic: var(--ironsworn-color-legacy-discoveries);
}

[data-legacy='bonds'] {
	--ironsworn-color-thematic: var(--ironsworn-color-legacy-bonds);
}

[data-legacy='quests'] {
	--ironsworn-color-thematic: var(--ironsworn-color-legacy-quests);
}

.legacy-track {
	// TODO: repeats progress track variables, because the xp boxes need them to calculate placement (and they aren't direct children of the progress track component... though maybe they should be?)
	--ironsworn-progress-box-border-radius: var(--ironsworn-border-radius-md);
	--ironsworn-progress-box-border-width: var(--ironsworn-border-width-md);
	// TODO: replace this with a 4px variable when available
	--ironsworn-progress-box-gap: 4px;
	--ironsworn-progress-box-max-size: 50px;
	--ironsworn-legacy-xp-box-size: 15px;
	--ironsworn-legacy-track-max-width: calc(
		(
			(var(--ironsworn-progress-box-max-size) * 10) +
				(var(--ironsworn-progress-box-gap) * 9)
		)
	);
	--ironsworn-legacy-xp-border-width: var(--ironsworn-border-width-md);

	display: grid;
	grid-template-rows: max-content max-content 0.5em max-content;
	grid-template-columns: max-content 1fr;
	max-width: var(--ironsworn-legacy-track-max-width);

	.legacy-track-title {
		grid-row: 1;
		grid-column: 1;
		margin: 0;
		text-transform: uppercase;
		line-height: 2;
		letter-spacing: 0.02em;
		font-weight: bold;
	}

	.legacy-track-controls {
		grid-row: 1;
		grid-column: 2;
		align-items: center;
		justify-content: end;

		.icon-button {
			height: 100%;
		}
	}

	.legacy-track-progress {
		grid-row: 2 / span 2;
		grid-column: 1 / span 2;
		max-width: var(--ironsworn-legacy-track-max-width);
	}

	.progress-track {
		margin: 0;
	}

	.progress-track-box {
		gap: var(--ironsworn-progress-box-gap);
		// extra padding to allow comfy overlap with xp pips (similar to legacy tracks on the SF character sheet and in the book's illustrations).
		padding-bottom: calc(var(--ironsworn-legacy-xp-box-size) * 0.4);
		max-width: var(--ironsworn-progress-box-max-size);
		max-height: unset;
	}

	.legacy-track-xp {
		display: grid;
		position: relative;
		grid-template-columns: repeat(20, 1fr);
		grid-row: 3 / span 2;
		grid-column: 1 / span 2;
		gap: var(--ironsworn-progress-box-gap);
		justify-self: center;
		width: 100%;
		max-width: var(--ironsworn-legacy-track-max-width);

		.xp-box {
			--ironsworn-legacy-xp-box-offset: calc(
				(
						var(--ironsworn-progress-box-gap) +
							var(--ironsworn-legacy-xp-border-width)
					) / -2
			);
			z-index: 1;
			margin: 0;
			border-width: var(--ironsworn-legacy-xp-border-width);
			width: 100%;
			max-width: var(--ironsworn-legacy-xp-box-size);

			&:not(:nth-child(n + 21)) {
				&:nth-child(2n) {
					justify-self: left;
					margin-left: var(--ironsworn-legacy-xp-box-offset);
					border-top-left-radius: 0;
					border-bottom-left-radius: 0;
				}

				&:nth-child(2n + 1) {
					justify-self: right;
					margin-right: var(--ironsworn-legacy-xp-box-offset);
					border-top-right-radius: 0;
					border-bottom-right-radius: 0;
				}
			}

			&:nth-child(n + 21) {
				grid-column: span 2;
				justify-self: center;
			}
		}
	}
}
</style>

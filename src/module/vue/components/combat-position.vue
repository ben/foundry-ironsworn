<template>
	<section
		class="flexrow nogrow"
		:class="$style.wrapper"
		data-tourid="combat-position"
	>
		<span class="nogrow" :class="$style.label">
			{{ $t(labels.title) }}
		</span>
		<div
			class="flexrow"
			:class="$style.options"
			role="radiogroup"
			:aria-label="$t(labels.title)"
		>
			<button
				v-for="option in options"
				:key="option.value"
				type="button"
				role="radio"
				class="clickable block"
				:class="[$style.option, { selected: current === option.value }]"
				:aria-checked="current === option.value"
				@click="setPosition(option.value)"
			>
				{{ $t(option.label) }}
			</button>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import type { CombatPosition } from '../../rolls/combat-position'
import { combatPositionLabelKey } from '../../rolls/combat-position'

const props = withDefaults(
	defineProps<{
		/**
		 * Which game's wording to use. Both store the same value: classic
		 * Ironsworn's "you have initiative" is Starforged's "in control".
		 */
		ruleset?: 'starforged' | 'classic'
	}>(),
	{ ruleset: 'starforged' }
)

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const current = computed<CombatPosition>(
	() => actor.value?.system?.combatPosition || 'none'
)

const classic = computed(() => props.ruleset === 'classic')

const labels = computed(() => ({
	title: classic.value
		? 'IRONSWORN.CombatPosition.Initiative'
		: 'IRONSWORN.CombatPosition.Label'
}))

const options = computed(() =>
	(['inControl', 'inABadSpot', 'none'] as CombatPosition[]).map((value) => ({
		value,
		label: combatPositionLabelKey(value, classic.value)
	}))
)

async function setPosition(value: CombatPosition) {
	if (value === current.value) return
	await $actor?.update({ system: { combatPosition: value } })
}
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-md);
	align-items: center;
}

.label {
	// Centre the text inside the label itself, so it lines up with the buttons
	// whether or not the row's align-items wins over core's .flexrow.
	display: flex;
	align-items: center;
	align-self: stretch;
	margin: 0;
	text-transform: uppercase;
	white-space: nowrap;
	// Match the impact category headings above (impact-category.vue).
	font-size: var(--font-size-14);
	font-weight: bold;
}

.options {
	gap: 0;
}

.option {
	flex: 1;
	margin: 0;
	border-width: var(--ironsworn-border-width-md);
	border-radius: 0;
	padding: var(--ironsworn-spacer-xs) var(--ironsworn-spacer-sm);
	height: auto;
	line-height: var(--ironsworn-line-height-md);

	&:first-child {
		border-top-left-radius: var(--ironsworn-border-radius-lg);
		border-bottom-left-radius: var(--ironsworn-border-radius-lg);
	}

	&:last-child {
		border-top-right-radius: var(--ironsworn-border-radius-lg);
		border-bottom-right-radius: var(--ironsworn-border-radius-lg);
	}

	& + & {
		border-left-width: 0;
	}
}
</style>

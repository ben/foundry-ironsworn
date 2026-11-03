<template>
	<section class="flexcol nogrow" :class="$style.wrapper">
		<!-- Heading and its + together, like the impact category headings below -->
		<div class="flexrow nogrow" :class="$style.header">
			<span
				class="nogrow"
				:class="$style.label"
				:data-tooltip="$t('IRONSWORN.NextMoveBonus.Hint')"
			>
				{{ $t('IRONSWORN.NextMoveBonus.Label') }}
			</span>
			<IronBtn
				nogrow
				icon="fa:plus"
				:tooltip="$t('IRONSWORN.NextMoveBonus.Add')"
				@click="addBonus"
			/>
		</div>
		<div v-if="bonuses.length > 0" class="flexcol" :class="$style.list">
			<div
				v-for="bonus in bonuses"
				:key="bonus.id"
				class="flexrow"
				:class="$style.bonus"
			>
				<input
					type="number"
					step="1"
					class="nogrow"
					:class="$style.value"
					:value="bonus.value"
					:aria-label="$t('IRONSWORN.Adds')"
					@change="updateBonus(bonus.id, { value: numberFrom($event) })"
				/>
				<input
					type="text"
					:class="$style.source"
					:value="bonus.source"
					:placeholder="$t('IRONSWORN.NextMoveBonus.SourcePlaceholder')"
					@change="updateBonus(bonus.id, { source: textFrom($event) })"
				/>
				<IronBtn
					nogrow
					icon="fa:xmark-circle"
					:tooltip="$t('IRONSWORN.NextMoveBonus.Remove')"
					@click="removeBonus(bonus.id)"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'
import type { NextMoveBonus } from '../../actor/subtypes/character'
import type { IronswornActor } from '../../actor/actor'

const actor = inject(ActorKey) as Ref
const $actor = inject($ActorKey)

const bonuses = computed<NextMoveBonus[]>(
	() => actor.value?.system?.nextMoveBonuses ?? []
)

function numberFrom(event: Event) {
	return Number((event.target as HTMLInputElement).value) || 0
}

function textFrom(event: Event) {
	return (event.target as HTMLInputElement).value
}

// This component only appears on character sheets. Check the type rather than
// using `instanceof`, which can fail across Vite hot reloads in development.
const character = computed(() =>
	$actor?.type === 'character'
		? ($actor as IronswornActor<'character'>)
		: undefined
)

async function addBonus() {
	await character.value?.system.addNextMoveBonus('', 1)
}

async function removeBonus(id: string) {
	await character.value?.system.removeNextMoveBonuses([id])
}

async function updateBonus(id: string, changes: Partial<NextMoveBonus>) {
	const updated = bonuses.value.map((bonus) =>
		bonus.id === id ? { ...bonus, ...changes } : bonus
	)
	await $actor?.update({ system: { nextMoveBonuses: updated } })
}
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-sm);
}

.header {
	gap: var(--ironsworn-spacer-sm);
	justify-content: flex-start;
}

// Core sets `body.game .app.window-app .flexrow { align-items: initial }`,
// which outranks a module class, so centre each child with align-self instead.
.header > *,
.bonus > * {
	align-self: center;
}

.label {
	// Match the impact category headings in the same section (impact-category.vue)
	margin: 0;
	text-transform: uppercase;
	white-space: nowrap;
	font-size: var(--font-size-14);
	font-weight: bold;
}

.list {
	gap: var(--ironsworn-spacer-xs);
}

.bonus {
	gap: var(--ironsworn-spacer-sm);
}

.value {
	// The system always shows number spinners (styles/inputs.scss), so leave
	// room for two digits beside them.
	--ironsworn-next-move-bonus-value-width: 4em;

	width: var(--ironsworn-next-move-bonus-value-width);
}

.source {
	flex: 1;
}
</style>

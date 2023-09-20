<template>
	<ul class="list-block flexcol" :class="$style.wrapper">
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.discoverASite"
				:move="moves.discoverASite"
				class="nogrow" />
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.delveTheDepths"
				:move="moves.delveTheDepths"
				class="nogrow" />
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.findAnOpportunity"
				:move="moves.findAnOpportunity"
				class="nogrow" />
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.revealADanger"
				:move="moves.revealADanger"
				class="nogrow">
				<template #btn-oracle="{ disabled, ...props }">
					<BtnOracle
						v-bind="props"
						:disabled="disabled || !hasThemeAndDomain"
						@click="$site.system.revealADanger" />
				</template>
			</SfMoverow>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.checkYourGear"
				:move="moves.checkYourGear"
				class="nogrow" />
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.locateObjective"
				:move="moves.locateObjective"
				class="nogrow">
				<template #btn-roll-move="{ disabled, ...props }">
					<BtnRollmove
						v-bind="props"
						:click-fn="$site.system.locateYourObjective"
						:disabled="disabled || !hasThemeAndDomain" />
				</template>
			</SfMoverow>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.escapeTheDepths"
				:move="moves.escapeTheDepths"
				class="nogrow" />
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.revealADangerAlt"
				:move="moves.revealADangerAlt"
				class="nogrow" />
		</li>
	</ul>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject, reactive } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import type { Move } from '../../../features/custommoves'
import { createIronswornMoveTree } from '../../../features/custommoves'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey, ActorKey } from '../../provisions'
import BtnOracle from '../buttons/btn-oracle.vue'
import BtnRollmove from '../buttons/btn-rollmove.vue'

import SfMoverow from '../sf-moverow.vue'

const site = inject(ActorKey) as Ref<ActorSource<'site'>>
const $site = inject($ActorKey) as IronswornActor<'site'>

const hasThemeAndDomain = computed(() => {
	return !!(
		site?.value?.items.find((x) => x.type === 'delve-theme') &&
		site?.value?.items.find((x) => x.type === 'delve-domain')
	)
})

// Construct some moves to use with the new pipeline
const moves = reactive<{ [k: string]: Move }>({})
Promise.resolve().then(async () => {
	const moveTree = await createIronswornMoveTree()
	const delveMoves = moveTree.find(
		(x) => x.dataforgedCategory?.$id === 'Ironsworn/Moves/Delve'
	)
	if (!delveMoves) return

	const movesToFetch = {
		discoverASite: 'Ironsworn/Moves/Delve/Discover_a_Site',
		delveTheDepths: 'Ironsworn/Moves/Delve/Delve_the_Depths',
		findAnOpportunity: 'Ironsworn/Moves/Delve/Find_an_Opportunity',
		revealADanger: 'Ironsworn/Moves/Delve/Reveal_a_Danger',
		checkYourGear: 'Ironsworn/Moves/Delve/Check_Your_Gear',
		escapeTheDepths: 'Ironsworn/Moves/Delve/Escape_the_Depths',
		locateObjective: 'Ironsworn/Moves/Delve/Locate_Your_Objective',
		revealADangerAlt: 'Ironsworn/Moves/Delve/Reveal_a_Danger_alt'
	}

	for (const k of Object.keys(movesToFetch)) {
		moves[k] = delveMoves.moves.find(
			(x) => x.dataforgedMove?.$id === movesToFetch[k]
		)!
	}
})
</script>

<style lang="scss" module>
.wrapper {
	margin: 0;
	border-radius: var(--ironsworn-border-radius-lg);
	height: max-content;
}

.listItem {
	flex-grow: 0;
	border-color: var(--ironsworn-color-midtone-30);
	height: max-content;
}
</style>

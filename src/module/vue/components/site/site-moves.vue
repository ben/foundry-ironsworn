<template>
	<ul class="list-block flexcol" :class="$style.wrapper">
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.discoverASite"
				:move="moves.discoverASite"
				class="nogrow"
			/>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.delveTheDepths"
				:move="moves.delveTheDepths"
				class="nogrow"
			/>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.findAnOpportunity"
				:move="moves.findAnOpportunity"
				class="nogrow"
			/>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.revealADanger"
				:move="moves.revealADanger"
				class="nogrow"
			>
				<template #btn-oracle="{ disabled, ...props }">
					<BtnOracle
						v-bind="props"
						:disabled="disabled || !hasThemeAndDomain"
						:override-click="true"
						@click="revealADanger"
					/>
				</template>
			</SfMoverow>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.checkYourGear"
				:move="moves.checkYourGear"
				class="nogrow"
			/>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.locateObjective"
				:move="moves.locateObjective"
				class="nogrow"
			>
				<template #btn-roll-move="{ disabled, ...props }">
					<BtnRollmove v-bind="props" :clickFn="locateObjective" />
				</template>
			</SfMoverow>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.escapeTheDepths"
				:move="moves.escapeTheDepths"
				class="nogrow"
			/>
		</li>
		<li class="list-block-item" :class="$style.listItem">
			<SfMoverow
				v-if="moves.revealADangerAlt"
				:move="moves.revealADangerAlt"
				class="nogrow"
			/>
		</li>
	</ul>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject, reactive } from 'vue'
import type { IronswornActor } from '../../../actor/actor'
import type { DisplayMove } from '../../../features/custommoves'
import { createMoveTreeForRuleset } from '../../../features/custommoves'
import { IronswornPrerollDialog } from '../../../rolls'
import { $ActorKey, ActorKey } from '../../provisions'
import BtnOracle from '../buttons/btn-oracle.vue'
import BtnRollmove from '../buttons/btn-rollmove.vue'

import SfMoverow from '../move/sf-moverow.vue'

const site = inject(ActorKey) as Ref<ActorSource<'site'>>
const $site = inject($ActorKey) as IronswornActor<'site'>

const theme = computed(() => {
	return site?.value?.items.find((x) => x.type === 'delve-theme')
})
const domain = computed(() => {
	return site?.value?.items.find((x) => x.type === 'delve-domain')
})

// Construct some moves to use with the new pipeline
const moves = reactive<{ [k: string]: DisplayMove }>({})
const ruleset = await createMoveTreeForRuleset('delve')
const delveMoves = await ruleset.categories.find(
	(x) => x.ds?._id === 'move_category:delve/delve'
)
const moveDsIds = {
	discoverASite: 'move:delve/delve/discover_a_site',
	delveTheDepths: 'move:delve/delve/delve_the_depths',
	findAnOpportunity: 'move:delve/delve/find_an_opportunity',
	revealADanger: 'move:delve/delve/reveal_a_danger',
	checkYourGear: 'move:delve/delve/check_your_gear',
	escapeTheDepths: 'move:delve/delve/escape_the_depths',
	locateObjective: 'move:delve/delve/locate_your_objective',
	revealADangerAlt: 'move:delve/delve/reveal_a_danger_alt'
}
for (const [k, dsid] of Object.entries(moveDsIds)) {
	const dm = delveMoves?.moves.find((x) => x.ds?._id === dsid)
	moves[k] = dm!
}

const hasThemeAndDomain = computed(() => {
	return !!(theme.value && domain.value)
})
async function revealADanger() {
	return (await $site?.system.getDangers())?.draw()
}

async function locateObjective() {
	if (!$site) return
	const progress = Math.floor($site.system.current / 4)

	IronswornPrerollDialog.showForProgress(
		$site.name ?? '',
		progress,
		$site,
		'Ironsworn/Moves/Delve/Locate_Your_Objective'
	)
}
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

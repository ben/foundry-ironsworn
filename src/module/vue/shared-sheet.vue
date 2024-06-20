<template>
	<SheetBasic :document="data.actor" class="shared-sheet" body-class="flexrow">
		<section class="flexcol">
			<section v-if="hasBonds" class="sheet-area nogrow">
				<bonds :compact-progress="true" />
			</section>

			<active-completed-progresses />

			<section class="sheet-area flexcol">
				<h4 class="nogrow">{{ $t('Notes') }}</h4>
				<mce-editor v-model="data.actor.system.biography" @save="saveNotes" />
			</section>
		</section>
		<section class="condition-meters nogrow flexcol">
			<ConditionMeter
				slider-style="vertical"
				class="nogrow"
				attr="supply"
				:stat-label="$t('IRONSWORN.Supply')"
				:max="data.actor.system.supply.max"
				:min="data.actor.system.supply.min"
				document-type="Actor"
				:global="IronswornSettings.get('shared-supply')"
			/>
			<ConditionMeter
				v-if="IronswornSettings.get('character-hold')"
				slider-style="vertical"
				attr="hold"
				:stat-label="$t('IRONSWORN.Hold')"
				:max="data.actor.system.hold.max"
				:min="data.actor.system.hold.min"
				document-type="Actor"
				:global="IronswornSettings.get('shared-supply')"
			/>
		</section>
	</SheetBasic>
</template>

<script setup lang="ts">
import { provide, computed, inject } from 'vue'
import { $ActorKey, ActorKey } from './provisions'
import Bonds from './components/bonds.vue'
import MceEditor from './components/mce-editor.vue'
import ActiveCompletedProgresses from 'component:progress/active-completed-progresses.vue'
import SheetBasic from './sheet-basic.vue'
import ConditionMeter from './components/resource-meter/condition-meter.vue'
import { IronswornSettings } from '../helpers/settings.js'

const props = defineProps<{
	data: { actor: ActorSource<'shared'> }
}>()
provide(ActorKey, computed(() => props.data.actor) as any)
const $actor = inject($ActorKey)

const hasBonds = computed(() => {
	const bonds = props.data.actor.items.find((x) => x.type === 'bondset') as
		| ItemSource<'bondset'>
		| undefined
	const markedBonds = bonds?.system.bonds?.length
	return markedBonds && markedBonds > 0
})

function saveNotes() {
	$actor?.update({ 'system.biography': props.data.actor.system.biography })
}
</script>

<style lang="scss" scoped>
.stat-roll {
	text-transform: uppercase;
}

h3 {
	transition: background-color 0.2s ease;
	margin: var(--ironsworn-spacer-md) 0;
}

textarea.notes {
	flex: 1;
	border-radius: var(--ironsworn-border-radius-sm);
	border-color: var(--ironsworn-color-fg-10);
	min-height: 150px;
	resize: none;
	font-family: var(--font-primary);
}

.condition-meters {
	border-left: 1px solid;
	margin-left: var(--ironsworn-spacer-md);
	--ironsworn-meter-spacing: 6px;

	gap: var(--ironsworn-meter-spacing);

	.condition-meter {
		&:not(:first-child) {
			padding-top: var(--ironsworn-meter-spacing);
		}
	}

	button {
		height: max-content;
	}
}
</style>

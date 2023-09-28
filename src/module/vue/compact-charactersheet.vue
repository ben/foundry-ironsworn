<template>
	<div class="flexcol" :class="$style.wrapper">
		<section :class="$style.stats" class="flexrow nogrow">
			<AttrBox style="flex: 1" attr="edge" />
			<AttrBox style="flex: 1" attr="heart" />
			<AttrBox style="flex: 1" attr="iron" />
			<AttrBox style="flex: 1" attr="shadow" />
			<AttrBox style="flex: 1" attr="wits" />
		</section>

		<section class="boxgroup nogrow">
			<div class="flexrow boxrow">
				<CompactCharacterSheetButton prop-key="momentum" />
				<CompactCharacterSheetButton prop-key="health" />
				<CompactCharacterSheetButton prop-key="spirit" />
				<CompactCharacterSheetButton prop-key="supply" />
			</div>
		</section>

		<section class="flexrow nogrow" :class="$style.impacts">
			<PcImpacts />
		</section>
	</div>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'
import AttrBox from './components/attr-box.vue'
import CompactCharacterSheetButton from './components/compact-character-sheet-button.vue'
import ConditionCheckbox from 'component:impact/impact-checkbox.vue'
import { ActorKey } from './provisions'
import PcImpacts from './components/impact/pc-impacts.vue'

const props = defineProps<{
	data: {
		actor: any
	}
}>()

provide(ActorKey, computed(() => props.data.actor) as any)
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-lg);
}

.stats {
	gap: var(--ironsworn-spacer-lg);
}

.statbox {
	flex: 1 !important;
}

.box {
	padding: var(--ironsworn-spacer-sm);
}

.impacts {
	align-items: center;
	justify-content: space-around;
	padding: 0 var(--ironsworn-spacer-sm);
	input[type='text'] {
		width: 15ch;
		min-width: 10ch;
		max-width: 30ch;
	}
}
</style>

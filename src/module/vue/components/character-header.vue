<template>
	<SheetHeaderBasic class="nogrow" :document="actor">
		<section
			class="flexrow xp-track-classic"
			style="gap: var(--ironsworn-spacer-md)">
			<h4 class="nogrow" style="margin: 0">{{ $t('IRONSWORN.XP') }}</h4>
			<div class="flexrow">
				<XpBox :key="0" :current="-1" :value="0" @click="setXp(0)"> × </XpBox>
				<XpBox
					v-for="n in xpArray"
					:key="n"
					:value="n"
					:current="actor.system.xp"
					@click="setXp(n)" />
			</div>
		</section>
	</SheetHeaderBasic>
</template>
<style lang="scss">
.xp-track-classic {
	--ironsworn-xp-box-size: 15px;
	--ironsworn-xp-track-classic-size: 130px;

	flex-basis: var(--ironsworn-xp-track-classic-size);
	flex-direction: row;
	flex-grow: 0;
	align-items: center;

	.xp-box {
		box-sizing: border-box;
		display: flex;
		flex-basis: var(--ironsworn-xp-box-size);
		align-items: center;
		justify-content: center;
		margin: var(--ironsworn-spacer-sm);
		border: var(--ironsworn-border-width-md) solid currentcolor;
		background-clip: content-box;
		padding: var(--ironsworn-spacer-xs);
		height: var(--ironsworn-xp-box-size);
		text-align: center;
		aspect-ratio: 1;

		&.selected {
			background-color: currentcolor;
		}
	}
}
</style>
<script setup lang="ts">
import SheetHeaderBasic from '../sheet-header-basic.vue'
import { Ref, inject } from 'vue'
import { $ActorKey, ActorKey } from '../provisions'
import XpBox from './xp-box.vue'

const actor = inject(ActorKey) as Ref
const xpArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const $actor = inject($ActorKey)
function setXp(n) {
	$actor?.update({ system: { xp: n } })
}
</script>

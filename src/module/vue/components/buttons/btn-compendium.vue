<template>
	<IronBtn
		class="btn-compendium"
		@click="openCompendium"
		aria-haspopup="dialog"
		icon="fa:book-atlas"
		v-bind="($props, $attrs)">
		<template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script lang="ts" setup>
import { ExtractPropTypes } from 'vue'
import IronBtn from './iron-btn.vue'

interface Props extends ExtractPropTypes<typeof IronBtn> {
	compendium: string
}

const props = defineProps<Props>()

async function openCompendium() {
	const pack = game.packs?.get(`foundry-ironsworn.${props.compendium}`)
	pack?.render(true)
}
</script>

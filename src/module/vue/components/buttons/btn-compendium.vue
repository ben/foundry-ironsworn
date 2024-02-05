<template>
	<IronBtn
		class="btn-compendium"
		aria-haspopup="dialog"
		icon="fa:book-atlas"
		v-bind="($props, $attrs)"
		@click="openCompendium">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script lang="ts" setup>
import IronBtn from './iron-btn.vue'

interface Props extends /* @vue-ignore */ PropsOf<typeof IronBtn> {
	compendium: string
}

const props = defineProps<Props>()

async function openCompendium() {
	const pack = game.packs?.get(`foundry-ironsworn.${props.compendium}`)
	pack?.render(true)
}
</script>

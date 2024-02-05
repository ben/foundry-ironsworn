<template>
	<IronBtn
		:class="$style.wrapper"
		aria-haspopup="dialog"
		:tooltip="btnText ? undefined : text"
		:text="btnText ? text : undefined"
		:icon="'fa:trash'"
		v-bind="($props, $attrs)"
		@click="document.deleteDialog(dialogOptions)">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import IronBtn from './iron-btn.vue'

interface Props
	extends /* @vue-ignore */ Omit<PropsOf<typeof IronBtn>, 'text' | 'icon'> {
	document: ClientDocument
	dialogOptions?: Partial<DialogOptions>
	/** @default `false` */
	btnText?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	dialogOptions: {} as any,
	btnText: false
})

const typeLabel = computed<string>(() => {
	const type =
		(props.document as any).type ??
		props.document.getFlag('foundry-ironsworn', 'type')
	const docConfig = CONFIG[(props.document as any).documentName]
	if ('typeLabels' in docConfig)
		return game.i18n.localize(docConfig.typeLabels?.[type])

	return game.i18n.localize(
		(
			props.document.constructor as typeof foundry.abstract.Document<
				any,
				any,
				any
			>
		).metadata.label
	)
})

const text = computed(() =>
	game.i18n.format(`DOCUMENT.Delete`, {
		type: typeLabel.value
	})
)
</script>

<style lang="scss" module>
.wrapper {
}
</style>

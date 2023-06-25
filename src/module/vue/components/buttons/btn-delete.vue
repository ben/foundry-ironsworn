<template>
	<IronBtn
		:class="$style.wrapper"
		aria-haspopup="dialog"
		:tooltip="text"
		v-bind="($props, $attrs)"
		@click=";(document as any).deleteDialog(dialogOptions)">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import IronBtn from './iron-btn.vue'
import type {
	ConfiguredDocumentClassForName,
	DocumentType
} from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

interface Props extends PropsOf<typeof IronBtn> {
	document: InstanceType<ConfiguredDocumentClassForName<DocumentType>>
	dialogOptions?: Partial<DialogOptions>
}

const props = withDefaults(defineProps<Props>(), {
	icon: 'fa:trash',
	dialogOptions: {} as any
})

const typeLabel = computed<string>(() => {
	const type =
		(props.document as any).type ??
		props.document.getFlag('foundry-ironsworn', 'type')
	const docConfig = CONFIG[props.document.documentName]
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

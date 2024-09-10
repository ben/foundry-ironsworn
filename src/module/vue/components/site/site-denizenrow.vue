<template>
	<DropTarget is="tr" drop-type="progress" :class="$style.tr">
		<td width="60">
			<span v-if="denizen.range[0] === denizen.range[1]">{{
				denizen.range[0]
			}}</span>
			<span v-else>{{ denizen.range[0] }}–{{ denizen.range[1] }}</span>
		</td>
		<td>
			<input
				v-if="editMode"
				ref="description"
				type="text"
				:class="{ highlight: focused, [$style.input]: true }"
				:value="denizen.text"
				:placeholder="frequencyLabel"
				@input="input"
			/>
			<Suspense v-else>
				<RenderedText element="div" :content="denizen.text" />
			</Suspense>
		</td>
	</DropTarget>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RenderedText from 'component:rendered-text.vue'
import DropTarget from '../../drop-target.vue'

const denizen = defineModel()

const props = defineProps<{ editMode: boolean }>()

const focused = ref(false)
const description = ref<HTMLInputElement>()
function focus() {
	focused.value = true
	description.value?.focus()
	setTimeout(() => (focused.value = false), 5000)
}
defineExpose({ focus })
</script>

<style lang="scss" module>
.tr {
	height: 20px;
	padding: 1px;
}
.input {
	height: 19px !important;
}
</style>

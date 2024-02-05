<template>
	<label class="nogrow flexrow">
		<input
			ref="radio"
			type="radio"
			:name="radioGroup"
			class="nogrow"
			@change="select" />
		<MceEditor
			ref="editor"
			v-model="state.html"
			:style="{ height: state.height, 'min-height': state.height }"
			@save="emitHtml" />
	</label>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import MceEditor from '../mce-editor.vue'

const props = defineProps<{
	radioGroup: string
}>()

const radio = ref<HTMLElement>()
const editor = ref<typeof MceEditor>()

const state = reactive({
	html: '',
	height: '35px'
})

function select() {
	editor.value?.enableEditor()
	state.height = '300px'
}

const $emit = defineEmits<{
	change: [string]
}>()
function emitHtml() {
	$emit('change', state.html)
}
</script>

<style lang="scss" scoped>
input[type='radio'] {
	flex-grow: 0;
	align-self: flex-start;
	margin: var(--ironsworn-spacer-lg);
}
</style>

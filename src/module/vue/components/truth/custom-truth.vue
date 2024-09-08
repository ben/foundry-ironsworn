<template>
	<label class="nogrow flexrow">
		<input
			ref="radio"
			type="radio"
			:name="radioGroup"
			class="nogrow"
			@change="select"
		/>
		<MceEditor
			ref="editor"
			v-model="state.html"
			:style="{ height: state.height, 'min-height': state.height }"
			@save="emitHtml"
		/>
	</label>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import MceEditor from '../mce-editor.vue'

defineProps<{
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

// Do not emit change events from the editor if we've been unmounted
let emitChanges = true
onBeforeUnmount(() => {
	emitChanges = false
})

const $emit = defineEmits<{
	change: [string]
}>()
function emitHtml() {
	if (emitChanges) $emit('change', state.html)
}
</script>

<style lang="scss" scoped>
input[type='radio'] {
	flex-grow: 0;
	align-self: flex-start;
	margin: var(--ironsworn-spacer-lg);
}
</style>

<template>
	<div v-if="data.editing" class="editor flexcol">
		<Editor
			v-bind="$attrs"
			:model-value="modelValue"
			:init="mceConfig"
			@blur="$emit('save')" />
	</div>
	<div v-else class="editor flexcol">
		<with-rolllisteners
			v-if="interceptClicks"
			element="div"
			class="editor-content"
			@moveclick="moveClick"
			@oracleclick="oracleClick"
			v-html="$enrichHtml(modelValue)" />
		<div v-else class="editor-content" v-html="$enrichHtml(modelValue)"></div>
		<a class="editor-edit">
			<i class="fas fa-edit" @click="data.editing = true"></i>
		</a>
	</div>
</template>

<script setup lang="ts">
import type { RawEditorOptions } from 'tinymce'
import { onUnmounted, reactive } from 'vue'
import type { IronswornItem } from '../../item/item'
import Editor from '@tinymce/tinymce-vue'
import WithRolllisteners from './with-rolllisteners.vue'

const props = withDefaults(
	defineProps<{
		modelValue: string
		interceptClicks?: boolean
		editing?: boolean
	}>(),
	{
		interceptClicks: true
	}
)

const data = reactive({ editing: props.editing ?? false })

// Outbound link clicks: broadcast events
function moveClick(move: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', move.uuid)
}
function oracleClick(dfId: string) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfId)
}

const $emit = defineEmits<{ (e: 'save') }>()

onUnmounted(() => $emit('save'))

function enableEditor() {
	data.editing = true
}
defineExpose({ enableEditor })

const mceConfig: RawEditorOptions = {
	...CONFIG.TinyMCE,

	// TODO: this never gets called?
	file_picker_callback(pickerCallback, _value, _meta) {
		const filePicker = new FilePicker({
			type: 'image',
			callback: (path) => {
				pickerCallback(path)
				// Reset our z-index for next open
				$('.tox-tinymce-aux').css({ zIndex: '' })
			}
		})
		filePicker.render()
		// Set the TinyMCE dialog to be below the FilePicker
		$('.tox-tinymce-aux').css({ zIndex: Math.min(++_maxZ, 9999) })
	},

	save_enablewhendirty: false,
	save_onsavecallback: async (...args) => {
		$emit('save')
		data.editing = false
	},

	init_instance_callback: (editor) => {
		const window = editor.getWin()
		editor.selection.setCursorLocation(
			editor.getBody(),
			editor.getBody().childElementCount
		)
		window.addEventListener(
			'wheel',
			(event) => {
				if (event.ctrlKey) event.preventDefault()
			},
			{ passive: false }
		)
		window.addEventListener('drop', (ev) =>
			(TextEditor as any)._onDropEditorData(ev, editor)
		)
	}
}
</script>

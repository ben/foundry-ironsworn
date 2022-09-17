<template>
  <div v-if="data.editing" class="editor flexcol">
    <Editor v-bind="$attrs" :modelValue="modelValue" :init="mceConfig" />
  </div>
  <div v-else class="editor flexcol">
    <with-rolllisteners
      v-if="interceptClicks"
      element="div"
      @moveclick="moveClick"
      @oracleclick="oracleClick"
      class="editor-content"
      v-html="$enrichHtml(modelValue)"
    />
    <div v-else class="editor-content" v-html="$enrichHtml(modelValue)"></div>
    <a class="editor-edit">
      <i class="fas fa-edit" @click="data.editing = true"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
import { RawEditorSettings } from 'tinymce'
import { inject, reactive } from 'vue'
import { $EmitterKey } from '../provisions'
import { IronswornItem } from '../../item/item'
import Editor from '@tinymce/tinymce-vue'
import WithRolllisteners from './with-rolllisteners.vue'

defineProps<{ modelValue: string; interceptClicks?: boolean }>()

const data = reactive({ editing: false })

// Outbound link clicks: broadcast events
const $emitter = inject($EmitterKey)
function moveClick(move: IronswornItem) {
  $emitter?.emit('highlightMove', move.id ?? '')
}
function oracleClick(dfId: string) {
  $emitter?.emit('highlightOracle', dfId)
}

const $emit = defineEmits<{ (e: 'save') }>()

const mceConfig: RawEditorSettings = {
  ...CONFIG.TinyMCE,

  // TODO: this never gets called?
  file_picker_callback(pickerCallback, _value, _meta) {
    let filePicker = new FilePicker({
      type: 'image',
      callback: (path) => {
        pickerCallback(path)
        // Reset our z-index for next open
        $('.tox-tinymce-aux').css({ zIndex: '' })
      },
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
  },
}
</script>

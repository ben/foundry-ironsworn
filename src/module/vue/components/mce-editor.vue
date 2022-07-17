<template>
  <div v-if="data.editing" class="editor flexcol">
    <Editor v-bind="$attrs" :modelValue="modelValue" :init="mceConfig" />
  </div>
  <div v-else class="editor flexcol">
    <div class="editor-content" v-html="$enrichHtml(modelValue)" />
    <a class="editor-edit">
      <i class="fas fa-edit" @click="data.editing = true"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue'
import { RawEditorSettings } from 'tinymce'
import { nextTick, reactive } from 'vue'

defineProps<{ modelValue: string }>()

const data = reactive({ editing: false })
const $emit = defineEmits<{ (e: 'save') }>()

const mceConfig: RawEditorSettings = {
  ...CONFIG.TinyMCE,

  // TODO: this never gets called?
  file_picker_callback(pickerCallback, _value, _meta) {
    console.log(pickerCallback, _value, _meta)
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
    console.log(editor)
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
      TextEditor._onDropEditorData(ev, editor)
    )
  },
}
console.log(mceConfig)
</script>

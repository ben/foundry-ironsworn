<template>
  <article v-if="data.editing" class="editor mce-editor flexcol">
    <Editor
      v-bind="$attrs"
      :modelValue="modelValue"
      :init="mceConfig"
      tagName="article"
    />
  </article>
  <article v-else class="editor mce-editor flexcol">
    <with-rolllisteners
      v-if="interceptClicks"
      element="div"
      @moveclick="moveClick"
      @oracleclick="oracleClick"
      class="editor-content"
      v-html="$enrichHtml(modelValue)"
    />
    <div v-else class="editor-content" v-html="$enrichHtml(modelValue)"></div>
    <BtnFaicon
      class="editor-edit btn-block"
      icon="fas fa-edit"
      @click="data.editing = true"
    />
  </article>
</template>

<style lang="less">
@import '../../../styles/forms.less';
@import '../../../styles/button.less';
.mce-editor {
  height: 100%;
  min-height: 100px;
  color: var(--ironsworn-color-fg);
  background-color: initial;

  .editor-content {
    height: inherit;
    min-height: inherit;
  }
  .editor-edit {
    background-color: var(--ironsworn-color-btn-bg-enabled);
    border-width: 0;
    box-shadow: none;
  }
  .tox {
    &:not(.tox-tinymce-inline) {
      .tox-editor-header {
        box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.2),
          0 8px 8px -4px rgba(0, 0, 0, 0.1);
      }
    }
    &.tox-tinymce {
      border-radius: 0;
    }

    .tox-editor-header,
    .tox-toolbar-overlord,
    .tox-toolbar__primary {
      background-color: var(--ironsworn-color-bg);
    }
    .tox-edit-area {
      .textInputBackground();
      border-radius: 0 0 var(--ironsworn-border-radius-lg)
        var(--ironsworn-border-radius-lg);
      border-width: 0 var(--ironsworn-border-width)
        var(--ironsworn-border-width);
      padding: 3px;
    }
    .tox-toolbar__group {
      flex-grow: 1;
    }
    .tox-tbtn {
      cursor: pointer;

      color: var(--ironsworn-color-btn-fg-enabled);
      background: var(--ironsworn-color-btn-bg-enabled);
      svg {
        fill: var(--ironsworn-color-btn-fg-enabled);
      }
      &:hover {
        color: var(--ironsworn-color-btn-fg-hover);
        background: var(--ironsworn-color-btn-bg-hover);
        svg {
          fill: var(--ironsworn-color-btn-fg-hover);
        }
      }
    }
  }
}

.ProseMirror {
  background-color: var(--ironsworn-color-bg-faded);
  padding: 0.5rem;
}
.prosemirror button,
.tox .tox-tbtn--bespoke {
  background-color: var(--ironsworn-color-bg-faded);
  color: var(--ironsworn-color-fg);
  fill: var(--ironsworn-color-fg);
  border-color: var(--ironsworn-color-border-faded);
}
</style>

<script setup lang="ts">
import { RawEditorSettings } from 'tinymce'
import { inject, reactive } from 'vue'
import { IronswornItem } from '../../item/item'
import Editor from '@tinymce/tinymce-vue'
import WithRolllisteners from './with-rolllisteners.vue'
import BtnFaicon from './buttons/btn-faicon.vue'

defineProps<{ modelValue: string; interceptClicks?: boolean }>()

const data = reactive({ editing: false })

// Outbound link clicks: broadcast events
function moveClick(move: IronswornItem) {
  CONFIG.IRONSWORN.emitter.emit('highlightMove', move.id ?? '')
}
function oracleClick(dfId: string) {
  CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfId)
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

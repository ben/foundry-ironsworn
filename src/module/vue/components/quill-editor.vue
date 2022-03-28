<template>
  <div
    style="border: 1px solid black"
    :class="cssClasses"
    @dragenter="dragHandler($event, true)"
    @dragover="dragHandler($event, true)"
    @dragleave="dragHandler($event, false)"
    @dragend="dragHandler($event, false)"
    @drop="dropHandler"
  >
    <VueEditor
      :placeholder="placeholder"
      :editorOptions="options"
      v-bind:value="value"
      @input="$emit('input', $event)"
      class="flexcol"
      style="height: 100%; width: 100%"
    />
  </div>
</template>

<style lang="less">
.ql-container {
  font-family: var(--font-primary) !important;
}
.ql-editor {
  width: 100%;
}
.ql-tooltip {
  z-index: 100;
}
.ql-toolbar {
  flex-grow: 0;
}
.ql-container {
  display: flex;
  flex-grow: 1;
}
</style>

<script>
import { VueEditor } from 'vue2-editor'
import Delta from 'quill-delta'

export default {
  components: { VueEditor },

  props: {
    placeholder: String,
    value: String,

    theme: {
      type: String,
      default: 'snow',
    },

    toolbarOptions: {
      type: Array,
      default: [
        [{ header: [false, 1, 2, 3, 4] }, 'bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    },
  },

  data() {
    return {
      cssClasses: {
        'drag-highlight': false,
      },
      options: {
        theme: this.theme,
        modules: {
          toolbar: {
            container: this.toolbarOptions,
            handlers: {
              image() {
                const quill = this.quill
                new FilePicker({
                  type: 'image',
                  callback(path) {
                    const range = quill.getSelection(true)
                    const delta = new Delta()
                      .retain(range.index)
                      .delete(range.length)
                    delta.insert({ image: path })
                    quill.updateContents(delta, 'user')
                  },
                }).render(true)
              },
            },
          },
        },
      },
    }
  },

  methods: {
    dragHandler(ev, highlight) {
      console.log({ ev, highlight })
      this.cssClasses['drag-highlight'] = highlight
      ev.preventDefault()
      return false
    },

    dropHandler(ev) {
      ev.preventDefault()
      this.cssClasses['drag-highlight'] = false
      console.log('Drop!', ev)
    },
  },
}
</script>

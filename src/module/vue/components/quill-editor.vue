<template>
  <div
    style="border: 1px solid"
    :style="style"
    @dragenter="highlight"
    @dragleave="dehighlight"
    @dragover="highlight"
    @dragend="dehighlight"
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
      style: {
        'border-color': 'black'
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
    highlight(ev) {
      ev.preventDefault()
      this.style['border-color'] = 'red'
      return false
    },
    dehighlight(ev) {
      ev.preventDefault()
      this.style['border-color'] = 'black'
      return false
    },

    dropHandler(ev) {
      ev.preventDefault()
      console.log(ev)
    },
  },
}
</script>

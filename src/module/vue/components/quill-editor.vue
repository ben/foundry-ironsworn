<template>
  <div style="border: 1px solid black">
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

export default {
  components: { VueEditor },

  props: {
    placeholder: String,
    value: String,

    toolbarOptions: {
      type: Array,
      default: [
        [{ header: [false, 1, 2, 3, 4] }, 'bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
    },

    // options: {
    //   type: Object,
    //   default: {
    //     theme: 'bubble',
    //   },
    // },
  },

  data() {
    return {
      options: {
        theme: 'bubble',
        modules: {
          toolbar: {
            container: this.toolbarOptions,
            handlers: {
              image() {
                console.log(this)
                return '<img src="https://placekitten.com/200/300" />'
              },
            },
          },
        },
      },
    }
  },
}
</script>

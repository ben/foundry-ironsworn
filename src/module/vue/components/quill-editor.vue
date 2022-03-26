<template>
  <div>
    <VueEditor
      :placeholder="placeholder"
      :editorToolbar="toolbar"
      :editorOptions="options"
      v-bind:value="value"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<style lang="less">
.ql-container {
  font-family: var(--font-primary) !important;
}
.ql-tooltip {
  z-index: 100;
}
</style>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: { VueEditor },

  props: {
    placeholder: String,
    value: String,

    toolbar: {
      type: Array,
      default: [
        [{ header: [false, 1, 2, 3, 4] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['clean'],
      ],
    },

    options: {
      type: Object,
      default: {
        theme: 'bubble',
      },
    },
  },
}
</script>

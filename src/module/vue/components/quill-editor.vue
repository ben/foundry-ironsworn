<template>
  <div>
    <VueEditor
      :placeholder="placeholder"
      :editorToolbar="toolbar"
      :editorOptions="options"
      v-bind:value="value"
      @input="$emit('input', $event)"
      class="flexcol"
      style="height: 100%"
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

    toolbar: {
      type: Array,
      default: [
        [{ header: [false, 1, 2, 3, 4] }, 'bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [
          'link',
          // 'image'
        ],
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

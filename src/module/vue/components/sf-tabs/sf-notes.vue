<template>
  <div class="flexcol" style="margen: 1rem">
    <quill-editor v-model="actor.data.notes" :editorToolbar="toolbar" :editorOptions="options" />
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  props: {
    actor: Object,
  },

  data() {
    return {
      toolbar: [
        [{ header: [false, 1, 2, 3, 4] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['clean'],
      ],
      options: {
        theme: 'bubble'
      }
    }
  },

  watch: {
    'actor.data.notes'() {
      this.debouncedSave()
    },
  },

  created() {
    this.debouncedSave = debounce(this.save, 500)
  },

  methods: {
    save() {
      this.$actor.update({ 'data.notes': this.actor.data.notes })
    },
  },
}
</script>

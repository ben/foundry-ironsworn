<template>
  <div class="flexcol" style="margen: 1rem">
    <VueEditor :editorToolbar="toolbar" v-model="actor.data.notes" />
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { VueEditor } from 'vue2-editor'

export default {
  components: { VueEditor },

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

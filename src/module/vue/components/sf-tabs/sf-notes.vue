<template>
  <div class="flexcol">
    <quill-editor v-model="actor.data.notes" />
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  props: {
    actor: Object,
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

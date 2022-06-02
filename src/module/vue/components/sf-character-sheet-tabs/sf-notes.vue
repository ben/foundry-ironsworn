<template>
  <article class="notes-page flexcol">
    <quill-editor class="notes" v-model="actor.data.notes" />
  </article>
</template>

<style lang="less">
.notes-page {
}
</style>

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

<template>
  <div class="flexcol" style="margen: 1rem">
    <textarea
      style="resize: none"
      v-model="actor.data.notes"
      @blur="save"
    ></textarea>
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
  },

  methods: {
    save() {
      this.$actor.update({ 'data.notes': this.actor.data.notes })
    },
  },
}
</script>

<template>
  <div class="flexcol" style="margen: 1rem">
    <textarea
      v-model="actor.data.notes"
      @blur="save"
    ></textarea>
  </div>
</template>

<style lang="less" scoped>
input,
textarea {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  font-family: var(--font-primary);
  resize: none;
}
</style>

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

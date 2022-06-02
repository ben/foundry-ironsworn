<template>
  <section
    class="site-denizen-box box flexrow ironsworn__denizen__drop ironsworn__drop__target"
    data-drop-type="progress"
    :data-idx="idx"
  >
    <label class="denizen-dice-range nogrow">
      <span v-if="denizen.low === denizen.high">{{ denizen.low }}</span>
      <span v-else>{{ denizen.low }}–{{ denizen.high }}</span>
    </label>

    <input
      v-if="editMode"
      ref="description"
      type="text"
      :class="{ highlight: focused }"
      :value="denizen.description"
      @input="input"
      :placeholder="denizen.descriptor"
    />
    <div class="denizen-description" v-else v-html="$enrichHtml(denizen.description)" />
  </section>
</template>

<style lang="less">
.site-denizen-box {
  padding: 3px;
  .denizen-dice-range,
  .denizen-description {
    line-height: 26px;
  }
  .denizen-dice-range {
    white-space: nowrap;
    flex-basis: 4em;
  }
  input {
    transition: 0.4s ease-out;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    idx: Number,
  },

  data() {
    return { focused: false }
  },

  computed: {
    denizen() {
      return this.actor.data.denizens[this.idx]
    },

    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
  },

  methods: {
    input(ev) {
      const val = ev.currentTarget.value || ''
      const denizens = Object.values(this.$actor.data.data.denizens)
      denizens[this.idx].description = val
      this.$actor.update({ data: { denizens } })
    },

    focus() {
      console.log('focusing', this)
      this.focused = true
      this.$refs.description.focus()
      setTimeout(() => (this.focused = false), 5000)
    },
  },
}
</script>

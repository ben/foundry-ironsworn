<template>
  <div
    class="box flexrow ironsworn__denizen__drop ironsworn__drop__target"
    data-drop-type="progress"
    style="padding: 3px"
    :data-idx="idx"
  >
    <label
      class="nogrow"
      style="white-space: nowrap; flex-basis: 4em; line-height: 26px"
    >
      <span v-if="denizen.low === denizen.high">{{ denizen.low }}</span>
      <span v-else>{{ denizen.low }}–{{ denizen.high }}</span>
    </label>

    <input
      v-if="editMode"
      type="text"
      class="ironsworn__denizen__name"
      :data-idx="idx"
      :value="denizen.description"
      :placeholder="denizen.descriptor"
    />
    <div
      v-else
      style="line-height: 26px"
      v-html="$enrichHtml(denizen.description)"
    />
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    idx: Number,
  },

  computed: {
    denizen() {
      return this.actor.data.denizens[this.idx]
    },

    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
  },
}
</script>

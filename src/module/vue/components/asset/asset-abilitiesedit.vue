<template>
  <div>
    <div class="flexrow" v-for="(ability, i) in item.data.abilities" :key="i">
      <input
        type="checkbox"
        :checked="ability.enabled"
        @change="markAbility(i)"
      />
      <input
        v-if="editMode"
        type="text"
        v-model="ability.description"
        @blur="save"
      />
      <div v-else v-html="$enrichHtml(ability.description)" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },

  computed: {
    editMode() {
      return this.item.flags['foundry-ironsworn']?.['edit-mode']
    },
  },

  methods: {
    markAbility(idx) {
      const abilities = Object.values(this.item.data.abilities)
      abilities[idx] = { ...abilities[idx], enabled: !abilities[idx].enabled }
      this.$item.update({ data: { abilities } })
    },

    save() {
      const { abilities } = this.item.data
      this.$item.update({ data: { abilities } })
    },
  },
}
</script>

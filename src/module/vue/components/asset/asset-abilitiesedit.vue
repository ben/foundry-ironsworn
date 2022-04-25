<template>
  <div>
    <div
      class="flexcol"
      v-for="(ability, i) in item.data.abilities"
      :key="'ability' + i"
    >
      <div class="flexrow">
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

        <clock
          v-if="!editMode && ability.hasClock"
          class="nogrow"
          style="flex-basis: 100px"
          :wedges="ability.clockMax"
          :ticked="ability.clockTicks"
          @click="setClock(ability)"
        />
      </div>
      <div class="flexrow" v-if="editMode">
        <label>
          <input
            type="checkbox"
            :checked="ability.hasClock"
            @change="markClock(i)"
          />
          {{ $t('IRONSWORN.Clock') }}
        </label>
        <select
          class="nogrow"
          v-model="ability.clockMax"
          @change="clockMaxChange"
          style="margin: 0.5rem 0"
        >
          <option value="4">4 segments</option>
          <option value="6">6 segments</option>
          <option value="8">8 segments</option>
          <option value="10">10 segments</option>
          <option value="12">12 segments</option>
        </select>
      </div>
      <hr />
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

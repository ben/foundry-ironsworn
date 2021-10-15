<template>
  <div>
    <header class="sheet-header">
      <h1 class="charname">
        <input type="text" v-model="item.name" />
      </h1>
    </header>

    <p>
      <input v-if="editMode" type="text" v-model="item.data.description" />
      <span v-else>{{ item.data.description }}</span>
    </p>

    <!-- FIELDS -->
    <h3>{{ $t('IRONSWORN.Fields') }}</h3>
    <div class="boxgroup">
      <div
        class="flexrow boxrow nogrow fieldrow"
        v-for="(field, i) in item.data.fields"
        :key="i"
      >
        <div class="box flexrow" style="align-items: center">
          <input v-if="editMode" type="text" v-model="field.name" />
          <p v-else>{{ field.name }}</p>
        </div>
        <div class="box flexrow">
          <input type="text" v-model="field.value" />
        </div>
        <div v-if="editMode" class="box flexrow nogrow">
          <icon-button icon="trash" @click="deleteField(i)" />
        </div>
      </div>
      <div class="flexrow boxrow nogrow">
        <div
          class="box clickable block"
          @click="addField"
          style="min-height: 1.5rem; align-items: center"
        >
          <i class="fas fa-plus" />
        </div>
      </div>
    </div>

    <!-- ABILITIES -->
    <h3>{{ $t('IRONSWORN.Abilities') }}</h3>
    <div class="flexrow" v-for="(ability, i) in item.data.abilities" :key="i">
      <input
        type="checkbox"
        :checked="ability.enabled"
        @change="markAbility(i)"
      />
      <input v-if="editMode" type="text" v-model="ability.description" />
      <div v-else v-html="$enrichHtml(ability.description)" />
    </div>

    <!-- OPTIONS -->
    <h3>{{ $t('IRONSWORN.Options') }}</h3>
    <div class="flexcol stack">
      <div v-if="editMode">
        <div
          class="stack-row flexrow"
          v-for="(option, i) in item.data.exclusiveOptions"
          :key="i"
        >
          <input type="text" v-model="option.name" />
          <icon-button icon="trash" @click="deleteOption(i)" />
        </div>
        <div
          class="stack-row clickable block"
          @click="addOption"
          style="min-height: 1.5rem; align-items: center"
        >
          <i class="fas fa-plus" />
        </div>
      </div>
      <div v-else>
        <asset-exclusiveoption
          v-for="(opt, i) in item.data.exclusiveOptions"
          :key="i"
          :opt="opt"
          @click="markOption(i)"
        />
      </div>
    </div>

    <!-- TRACK -->
    <h3>{{ $t('IRONSWORN.Track') }}</h3>
    <asset-trackprops :item="item" />
  </div>
</template>

<style lang="less" scoped>
.fieldrow {
  p,
  input {
    text-align: left;
    padding: 0 0.5em;
    margin: 3px;
  }
}
h3 {
  margin-top: 1em;
}
</style>

<script>
import iconButton from './components/icon-button.vue'

function debouncedUpdate(key) {
  return CONFIG.IRONSWORN._.debounce(function () {
    if (
      !CONFIG.IRONSWORN._.isEqual(
        this.item.data[key],
        this.$item().data.data[key]
      )
    ) {
      const newValue = Object.values(this.item.data[key])
      this.$item().update({ data: { [key]: newValue } })
    }
  }, 1000)
}

export default {
  components: { iconButton },
  props: {
    item: Object,
  },

  computed: {
    editMode() {
      return this.item.flags['foundry-ironsworn']?.['edit-mode']
    },
  },

  watch: {
    'item.name': CONFIG.IRONSWORN._.debounce(function () {
      this.$item().update({ name: this.item.name })
    }, 1000),

    'item.data.description': CONFIG.IRONSWORN._.debounce(function () {
      this.$item().update({ data: { description: this.item.data.description } })
    }, 1000),

    'item.data.fields': {
      deep: true,
      handler: debouncedUpdate('fields'),
    },

    'item.data.abilities': {
      deep: true,
      handler: debouncedUpdate('abilities') ,
    },

    'item.data.exclusiveOptions': {
      deep: true,
      handler: debouncedUpdate('exclusiveOptions'),
    },
  },

  methods: {
    enterEditMode() {
      this.$item().setFlag('foundry-ironsworn', 'edit-mode', true)
    },

    addField() {
      this.enterEditMode()
      const fields = Object.values(this.item.data.fields)
      fields.push({ name: ' ', value: ' ' })
      this.$item().update({ data: { fields } })
    },

    deleteField(idx) {
      const fields = Object.values(this.item.data.fields)
      fields.splice(idx, 1)
      this.$item().update({ data: { fields } })
    },

    markAbility(idx) {
      const abilities = Object.values(this.item.data.abilities)
      abilities[idx] = { ...abilities[idx], enabled: !abilities[idx].enabled }
      this.$item().update({ data: { abilities } })
    },

    markOption(idx) {
      const exclusiveOptions = Object.values(this.item.data.exclusiveOptions)

      for (let i = 0; i < exclusiveOptions.length; i++) {
        exclusiveOptions[i] = {
          ...exclusiveOptions[i],
          selected: i === idx,
        }
      }
      this.$item().update({ data: { exclusiveOptions } })
    },

    deleteOption(idx) {
      const exclusiveOptions = Object.values(this.item.data.exclusiveOptions)
      exclusiveOptions.splice(idx, 1)
      this.$item().update({ data: { exclusiveOptions } })
    },

    addOption() {
      this.enterEditMode()
      const exclusiveOptions = Object.values(this.item.data.exclusiveOptions)
      exclusiveOptions.push({ name: ' ', value: ' ' })
      this.$item().update({ data: { exclusiveOptions } })
    },
  },
}
</script>

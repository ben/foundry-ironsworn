<template>
  <div>
    <header class="sheet-header">
      <h1 class="charname">
        <input type="text" v-model="item.name" @blur="setName" />
      </h1>
    </header>

    <p>
      <input
        v-if="editMode"
        type="text"
        v-model="item.data.description"
        @blur="setDescription"
      />
      <span v-else>{{ item.data.description }}</span>
    </p>

    <!-- FIELDS -->
    <h3>{{ $t('IRONSWORN.Fields') }}</h3>
    <asset-fieldsedit :item="item" />

    <!-- ABILITIES -->
    <h3>{{ $t('IRONSWORN.Abilities') }}</h3>
    <asset-abilitiesedit :item="item" />

    <!-- OPTIONS -->
    <div v-if="hasOptions || editMode">
      <h3>{{ $t('IRONSWORN.Options') }}</h3>
      <asset-optionsedit :item="item" />
    </div>

    <!-- TRACK -->
    <h3>{{ $t('IRONSWORN.Track') }}</h3>
    <asset-trackedit :item="item" />
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
        this.$item.data.data[key]
      )
    ) {
      const newValue = Object.values(this.item.data[key])
      this.$item.update({ data: { [key]: newValue } })
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

    hasOptions() {
      return Object.values(this.item.data.exclusiveOptions || []).length > 0
    },
  },

  methods: {
    setName() {
      this.$item.update({ name: this.item.name })
    },
    setDescription() {
      this.$item.update({ data: { description: this.item.data.description } })
    },
  },
}
</script>

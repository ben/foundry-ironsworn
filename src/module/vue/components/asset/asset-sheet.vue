<template>
  <article class="asset-sheet">
    <header class="sheet-header">
      <document-name :document="item" />
    </header>

    <p class="asset-description">
      <input v-if="editMode" type="text" v-model="item.data.description" @blur="setDescription" />
      <span v-else v-html="$enrichHtml(item.data.description)"></span>
    </p>

    <!-- FIELDS -->
    <div v-if="hasFields || editMode">
      <h3>{{ $t('IRONSWORN.Fields') }}</h3>
      <asset-fieldsedit :item="item" />
    </div>

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
    <asset-meteredit :item="item" />
  </article>
</template>

<style lang="less">
.asset-sheet {
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
}
</style>

<script>
export default {
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

    hasFields() {
      return Object.values(this.item.data.fields || []).length > 0
    },
  },

  methods: {
    setDescription() {
      this.$item.update({ data: { description: this.item.data.description } })
    },
  },
}
</script>

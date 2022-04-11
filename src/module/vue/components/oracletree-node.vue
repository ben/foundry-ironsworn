<template>
  <div class="flexcol">
    <h4 class="clickable text" @click="click">
      <i class="fa fa-dice-d6" v-if="oracle.foundryTable" />
      <span v-else-if="expanded"><i class="fa fa-caret-down" /></span>
      <span v-else><i class="fa fa-caret-right" /></span>
      {{ name }}
    </h4>

    <div class="flexcol" v-if="expanded" style="margin-left: 1rem">
      <oracletree-node
        v-for="child in children"
        :key="child.dfid"
        :oracle="child"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    oracle: Object,
    breadcrumbs: Boolean,
  },

  data() {
    return {
      expanded: false,
    }
  },

  computed: {
    children() {
      return [...(this.oracle.Categories ?? []), ...(this.oracle.Oracles ?? [])]
    },

    name() {
      const name = this.oracle.foundryItem?.name ?? this.$t(`IRONSWORN.${this.oracle.Display.Title}`)
      if (this.breadcrumbs) {
        return `${this.oracle.Category}/${name}`
      }
      return name
    },
  },

  methods: {
    async click() {
      if (this.oracle.foundryTable) {
        this.oracle.foundryTable.draw()
      } else {
        this.expanded = !this.expanded
      }
    },
  },
}
</script>

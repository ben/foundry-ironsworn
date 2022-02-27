<template>
  <div class="flexcol">
    <h4 class="clickable text" @click="click">
      <i class="fa fa-dice-d6" v-if="oracle.tableId" />
      <span v-else-if="expanded"><i class="fa fa-caret-down" /></span>
      <span v-else><i class="fa fa-caret-right" /></span>
      {{ oracle.title }}
    </h4>

    <div class="flexcol" v-if="expanded" style="margin-left: 1rem">
      <oracletree-node
        v-for="child in oracle.children"
        :key="child.key"
        :oracle="child"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    oracle: Object,
  },

  data() {
    return {
      expanded: false,
    }
  },

  methods: {
    async click() {
      if (this.oracle.tableId) {
        const pack = game.packs.get('foundry-ironsworn.starforgedoracles')
        const table = await pack?.getDocument(this.oracle.tableId)
        table?.draw()
      } else {
        this.expanded = !this.expanded
      }
    },
  },
}
</script>

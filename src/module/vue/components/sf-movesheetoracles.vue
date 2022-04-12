<template>
  <div class="flexcol">
    <div class="flexrow nogrow" style="margin-top: 0.5rem">
      <input
        type="text"
        :placeholder="$t('IRONSWORN.Search')"
        v-model="searchQuery"
      />
      <i
        class="fa fa-times-circle nogrow clickable text"
        @click="clearSearch"
        style="padding: 6px"
      />
    </div>

    <div class="flexcol item-list">
      <oracletree-node
        v-for="oracle in dfOracles"
        :key="oracle.key"
        :oracle="oracle"
        :searchQuery="searchQuery"
        ref="oracles"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.item-list {
  padding: 0 0.5rem;
}
</style>

<script>
import { cloneDeep } from 'lodash'

export default {
  props: {
    actor: Object,
  },

  data() {
    const dfOracles = CONFIG.IRONSWORN.cleanDollars(
      cloneDeep(CONFIG.IRONSWORN.Dataforged.oracles)
    )

    return {
      dfOracles,
      flatOracles: [],
      searchQuery: '',
    }
  },

  async created() {
    // Make sure all the oracles are loaded
    await this.getPack().getDocuments()

    // Walk the DF oracles and decorate with Foundry IDs
    const walk = async (node) => {
      const table = await CONFIG.IRONSWORN.getTableByDfId(node.dfid)
      if (table) {
        Vue.set(node, 'foundryTable', table)
        this.flatOracles.push(node)
      }

      for (const child of node.Oracles ?? []) await walk(child)
      for (const child of node.Categories ?? []) await walk(child)
    }
    for (const node of this.dfOracles) await walk(node)
  },

  computed: {
    searchResults() {
      if (!this.searchQuery) return null

      const re = new RegExp(this.searchQuery, 'i')
      return this.flatOracles.filter((x) =>
        re.test(`${x.Category}/${x.foundryTable.name}`)
      )
    },
  },

  methods: {
    getPack() {
      return game.packs.get('foundry-ironsworn.starforgedoracles')
    },

    clearSearch() {
      this.searchQuery = ''
    },
  },
}
</script>

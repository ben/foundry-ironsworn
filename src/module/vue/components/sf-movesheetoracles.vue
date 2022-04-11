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
      <div v-if="searchResults">
        <oracletree-node
          v-for="oracle in searchResults"
          :key="oracle.key"
          :oracle="oracle"
          :breadcrumbs="true"
        />
      </div>
      <div v-else>
        <oracletree-node
          v-for="oracle in dfOracles"
          :key="oracle.key"
          :oracle="oracle"
        />
      </div>
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
    const dfOracles = CONFIG.IRONSWORN.cleanDollars(cloneDeep(CONFIG.IRONSWORN.Dataforged.oracles))

    return {
      dfOracles,
      flatOracles: [],
      searchQuery: '',
    }
  },

  async created() {
    // Get documents from pack
    const tables = await this.getPack().getDocuments()

    // Walk the DF oracles and decorate with Foundry IDs
    const walk = (node) => {
      const table = tables.find(x => x.data.flags.dfId === node.dfid)
      if (table) {
        Vue.set(node, 'foundryTable', table)
        this.flatOracles.push(node)
      }

      (node.Oracles ?? []).forEach(walk)
    }
    this.dfOracles.forEach(walk)
  },

  computed: {
    searchResults() {
      if (!this.searchQuery) return null

      const re = new RegExp(this.searchQuery, 'i')
      return this.flatOracles.filter((x) => re.test(x.foundryTable.name))
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

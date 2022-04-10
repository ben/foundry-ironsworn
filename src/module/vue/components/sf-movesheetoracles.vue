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
        />
      </div>
      <div v-else>
        <oracletree-node
          v-for="oracle in oracles"
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
function setDeep(obj, key, val) {
  const parts = key.split(' / ').map((x) => x.trim())
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    obj[part] ||= {}
    obj = obj[part]
  }
  obj[parts[parts.length - 1]] = val
}

function oracleTree(obj, fullkey) {
  const ret = []

  for (const k of Object.keys(obj)) {
    const v = obj[k]
    const base = {
      title: k,
      key: `${fullkey}.${k}`,
    }
    // A string? That's a rollable table ID
    if (typeof v === 'string') {
      ret.push({ ...base, tableId: v })
    } else {
      ret.push({ ...base, children: oracleTree(v, `${fullkey}.${k}`) })
    }
  }

  return ret
}

export default {
  props: {
    actor: Object,
  },

  data() {
    const dfOracles = CONFIG.IRONSWORN.cleanDollars(cloneDeep(CONFIG.IRONSWORN.Dataforged.oracles))
    return {
      dfOracles,
      oracles: [],
      sortedOracles: [],
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
        Vue.set(node, 'foundryTableId', table.id)
      }

      (node.Oracles ?? []).forEach(walk)
    }
    this.dfOracles.forEach(walk)
  },

  computed: {
    searchResults() {
      if (!this.searchQuery) return null

      const re = new RegExp(this.searchQuery, 'i')
      return this.sortedOracles.filter((x) => re.test(x.title))
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

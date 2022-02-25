<template>
  <h1>foo</h1>
</template>

<script>
function setDeep(obj, key, val) {
  const parts = key.split('/').map((x) => x.trim())
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    obj[part] ||= {}
    obj = obj[part]
  }
  obj[parts[parts.length - 1]] = val
}

function oracleTree(obj) {
  const ret = []

  for (const k of Object.keys(obj)) {
    const v = obj[k]
    console.log({ k, v })
    // A string? That's a rollable table ID
    if (typeof(v) === 'string') {
      ret.push({ title: k, tableId: v })
    } else {
      ret.push({ title: k, children: oracleTree(v) })
    }
  }

  return ret
}

export default {
  props: {
    actor: Object,
  },

  data() {
    let oracles = []
    const pack = this.getPack()
    if (pack) {
      // Construct an index
      const index = {}
      for (const table of pack.index.values()) {
        setDeep(index, table.name, table._id)
      }

      // Explode into objects
      oracles = oracleTree(index)
    }

    console.log(oracles)
    return {
      oracles,
    }
  },

  methods: {
    getPack() {
      return game.packs.get('foundry-ironsworn.starforgedoracles')
    },
  },
}
</script>

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

export default {
  props: {
    actor: Object,
  },

  data() {
    return {
      oracles: null,
    }
  },

  async created() {
    const pack = game.packs.get('foundry-ironsworn.starforgedoracles')
    if (!pack) return

    const oracles = {}
    for (const table of pack.index.values()) {
      setDeep(oracles, table.name, table._id)
    }
    console.log(oracles)
    this.oracles = oracles
  },
}
</script>

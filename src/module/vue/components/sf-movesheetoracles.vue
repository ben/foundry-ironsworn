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
    const oracles = {}
    const pack = this.getPack()
    if (pack) {
      for (const table of pack.index.values()) {
        setDeep(oracles, table.name, table._id)
      }
    }

    return {
      oracles,
    }
  },

  methods: {
    getPack() {
      return game.packs.get('foundry-ironsworn.starforgedoracles')
    }
  }
}
</script>

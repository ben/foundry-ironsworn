<template>
  <div class="flexrow track">
    <assettrack-box
      v-for="x of trackValues"
      :key="x"
      :value="x"
      :actor="actor"
      :asset="asset"
    />
  </div>
</template>

<script>
export default {
  props: {
    actor: Object,
    asset: Object,
  },

  computed: {
    trackValues() {
      const ret = []
      for (let i = 0; i < this.asset.data.track.max; i++) ret.push(i)
      return ret
    },
  },
}
</script>

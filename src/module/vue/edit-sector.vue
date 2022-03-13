<template>
  <div class="flexcol">
    <h4 class="nogrow">{{ $t('IRONSWORN.Region') }}</h4>
    <label class="nogrow">
      <input type="radio" v-model="region" value="terminus" />
      {{ $t('IRONSWORN.Terminus') }}
    </label>
    <label class="nogrow">
      <input type="radio" v-model="region" value="outlands" />
      {{ $t('IRONSWORN.Outlands') }}
    </label>
    <label class="nogrow">
      <input type="radio" v-model="region" value="expanse" />
      {{ $t('IRONSWORN.Expanse') }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    sceneid: String,
  },

  computed: {
    foundryScene() {
      return game.scenes?.get(this.sceneid)
    },
    scene() {
      return this.foundryScene?.toObject(false)
    },
  },

  data() {
    return {
      region: null,
    }
  },

  mounted() {
    this.region = this.scene?.flags['foundry-ironsworn']?.['region']
  },

  watch: {
    region(newRegion) {
      this.foundryScene?.setFlag('foundry-ironsworn', 'region', this.region)
    },
  },
}
</script>

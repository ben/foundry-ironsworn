<template>
  <div class="flexcol">
    <div class="flexrow nogrow">
      <label>
        <input
          type="radio"
          :checked="isTerminus"
          @change="setArea('terminus')"
        />
        {{ $t('IRONSWORN.Terminus') }}
      </label>
      <label>
        <input
          type="radio"
          :checked="isOutlands"
          @change="setArea('outlands')"
        />
        {{ $t('IRONSWORN.Outlands') }}
      </label>
      <label>
        <input type="radio" :checked="isExpanse" @change="setArea('expanse')" />
        {{ $t('IRONSWORN.Expanse') }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sceneid: String,
  },

  computed: {
    scene() {
      return this.foundryScene()?.toObject(false)
    },
    currentArea() {
      return this.scene?.flags['foundry-ironsworn']?.['area']
    },
    isTerminus() {
      return this.currentArea === 'terminus'
    },
    isOutlands() {
      return this.currentArea === 'outlands'
    },
    isExpanse() {
      return this.currentArea === 'expanse'
    },
  },

  methods: {
    foundryScene() {
      return game.scenes?.get(this.sceneid)
    },

    setArea(value) {
      this.foundryScene()?.setFlag('foundry-ironsworn', 'area', value)
      this.scene.flags['foundry-ironsworn'].area = value
      console.log(this.currentArea)
    },
  },
}
</script>

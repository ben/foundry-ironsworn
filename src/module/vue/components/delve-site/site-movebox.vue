<template>
  <div class="site-movebox box flexrow clickable block" :aria-disabled="disabled" @click="click">
    <h4 class="site-movebox-title">
      {{ $t(i18nLabelKey) }}
    </h4>
  </div>
</template>

<style lang="less">
.site-movebox {
  .site-movebox-title {
    margin: 0;
    white-space: nowrap;
    flex-grow: 0;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    move: String,
    disabled: Boolean,
  },

  computed: {
    i18nLabelKey() {
      return `IRONSWORN.MoveContents.${this.move}.title`
    },
  },

  methods: {
    async click() {
      if (this.disabled) return
      const move = await CONFIG.IRONSWORN.moveDataByName(this.move)
      CONFIG.IRONSWORN.RollDialog.show({ move, site: this.$actor })
    },
  },
}
</script>
